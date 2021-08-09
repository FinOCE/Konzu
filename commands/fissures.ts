import {CommandInteraction, MessageEmbed} from 'discord.js'
import Client from '../models/Client'
import Command, {CommandOption, CommandOptionChoice} from '../models/Command'
import {ActionRow, SelectMenu, SelectMenuOption} from '../models/Component'
import API from '../utils/API'
import Fissures from '../types/Fissures'
import Formatting, {Platform} from '../utils/Formatting'
import Embed from '../models/Embed'

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
                .addChoice(new CommandOptionChoice('Switch', 'swi')),
            new CommandOption()
                .setName('tier')
                .setDescription('Select the tier of relic to list')
                .setType('STRING')
                .addChoice(new CommandOptionChoice('Lith', 'lith'))
                .addChoice(new CommandOptionChoice('Meso', 'meso'))
                .addChoice(new CommandOptionChoice('Neo', 'neo'))
                .addChoice(new CommandOptionChoice('Axi', 'axi'))
                .addChoice(new CommandOptionChoice('Requiem', 'requiem'))
        ])
    }

    async run(interaction: CommandInteraction) {
        // Defer interaction to wait for API response
        interaction.defer({fetchReply: true})

        // Get data relevant to platform
        let platform = interaction.options.get('platform')?.value as Platform
        let data: Fissures[] = await API.query(`${platform}/fissures`)

        let tier = interaction.options.get('tier')?.value as string | undefined

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

        let railjackEmoji = this.client.emojis.cache.get(this.client.config.snowflakes.emoji.railjack)

        // Fulfil deferred interaction
        interaction.followUp({
            embeds: [
                new Embed()
                    .setTitle(`Current Fissure Missions - ${Formatting.getPlatform(platform)}`)
                    .setDescription(
                        data
                            .filter(m => tier ? (m.tier.toLowerCase() === tier) : true)
                            .sort((a, b) => a.tierNum - b.tierNum)
                            .map(m => `${relicEmojis[m.tier]} ${factionEmojis[m.enemy]} ${m.isStorm ? railjackEmoji : ''} ${m.missionType} (${m.enemy} ${m.tier})`)
                            .join('\n')
                    )
            ],
            components: [
                new ActionRow()
                    .addComponent(
                        new SelectMenu()
                            .setName('Select fissure tier...')
                            .setCustomId('tier')
                            .addOption(new SelectMenuOption('Lith', 'lith')
                                .setDescription('Search for Lith fissures')
                                .setEmoji(this.client.config.snowflakes.emoji.lith))
                            .addOption(new SelectMenuOption('Meso', 'meso')
                                .setDescription('Search for Meso fissures')
                                .setEmoji(this.client.config.snowflakes.emoji.meso))
                            .addOption(new SelectMenuOption('Neo', 'neo')
                                .setDescription('Search for Neo fissures')
                                .setEmoji(this.client.config.snowflakes.emoji.neo))
                            .addOption(new SelectMenuOption('Axi', 'axi')
                                .setDescription('Search for Axi fissures')
                                .setEmoji(this.client.config.snowflakes.emoji.axi))
                            .addOption(new SelectMenuOption('Requiem', 'requiem')
                                .setDescription('Search for Requiem fissures')
                                .setEmoji(this.client.config.snowflakes.emoji.requiem))
                    )
            ]
        })
    }
}