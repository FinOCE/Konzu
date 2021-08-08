import {CommandInteraction} from 'discord.js'
import Client from '../models/Client'
import Command, {CommandOption, CommandOptionChoice} from '../models/Command'
import API from '../utils/API'
import Fissures from '../types/Fissures'

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
        let data: Fissures[] = await API.query(`${platform}/fissures`)

        // Get custom emoji
        let factionEmojis = {
            Grineer: this.client.emojis.cache.get(this.client.config.snowflakes.emoji.grineer),
            Corpus: this.client.emojis.cache.get(this.client.config.snowflakes.emoji.corpus),
            Infested: this.client.emojis.cache.get(this.client.config.snowflakes.emoji.infested),
            Orokin: this.client.emojis.cache.get(this.client.config.snowflakes.emoji.orokin)
        }

        let relicEmojis = {
            Lith: this.client.emojis.cache.get(this.client.config.snowflakes.emoji.lith),
            Meso: this.client.emojis.cache.get(this.client.config.snowflakes.emoji.meso),
            Neo: this.client.emojis.cache.get(this.client.config.snowflakes.emoji.neo),
            Axi: this.client.emojis.cache.get(this.client.config.snowflakes.emoji.axi),
            Requiem: this.client.emojis.cache.get(this.client.config.snowflakes.emoji.requiem)
        }

        // Fulfil deferred interaction
        interaction.followUp(`${data.sort((a, b) => a.tierNum - b.tierNum).map(m => `${relicEmojis[m.tier]} ${factionEmojis[m.enemy]} ${m.missionType} (${m.enemy} ${m.tier})`).join('\n')}`)
    }
}