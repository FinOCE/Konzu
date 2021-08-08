import {CommandInteraction} from 'discord.js'
import Client from '../models/Client'
import Command, {CommandOption, CommandOptionChoice} from '../models/Command'
import API from '../utils/API'

export default class extends Command {
    constructor(client: Client) {
        super(client)

        this.setDescription('Check current void fissures')
        this.addOptions([
            new CommandOption()
                .setName('platform')
                .setDescription('Select the platform you play on')
                .setType('STRING')
                .makeRequired()
                .addChoice(new CommandOptionChoice('PC', 'pc'))
                .addChoice(new CommandOptionChoice('Playstation', 'ps4'))
                .addChoice(new CommandOptionChoice('Xbox', 'xb1'))
                .addChoice(new CommandOptionChoice('Switch', 'swi'))
        ])
    }

    async run(interaction: CommandInteraction) {
        // Defer interaction to wait for API response
        interaction.defer({fetchReply: true})

        // Get data relevant to platform
        let platform = interaction.options.get('platform')?.value as string
        let data = await API.query(`${platform}/fissures`)

        // Get custom emoji
        let factionEmojis = {
            grineer: this.client.emojis.cache.get(this.client.config.snowflakes.emoji.grineer),
            corpus: this.client.emojis.cache.get(this.client.config.snowflakes.emoji.corpus),
            infested: this.client.emojis.cache.get(this.client.config.snowflakes.emoji.infested),
            orokin: this.client.emojis.cache.get(this.client.config.snowflakes.emoji.orokin)
        }

        let relicEmojis = {
            lith: this.client.emojis.cache.get(this.client.config.snowflakes.emoji.lith),
            meso: this.client.emojis.cache.get(this.client.config.snowflakes.emoji.meso),
            neo: this.client.emojis.cache.get(this.client.config.snowflakes.emoji.neo),
            axi: this.client.emojis.cache.get(this.client.config.snowflakes.emoji.axi),
            requiem: this.client.emojis.cache.get(this.client.config.snowflakes.emoji.requiem)
        }

        // Fulfil deferred interaction
        interaction.followUp(`${data.map((m: any) => `${
            relicEmojis[m.tier.toLowerCase() as 'lith' | 'meso' | 'neo' | 'axi' | 'requiem']
        } ${
            factionEmojis[m.enemy.toLowerCase() as 'grineer' | 'corpus' | 'infested' | 'orokin']
        } ${m.missionType} (${m.enemy} ${m.tier})`).join('\n')}`)
    }
}