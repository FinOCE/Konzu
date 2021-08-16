import {CommandInteraction} from 'discord.js'
import Client from '../models/Client'
import Command, {CommandOption, CommandOptionChoice} from '../models/Command'
import {ActionRow, SelectMenu, SelectMenuOption} from '../models/Component'
import API from '../utils/API'
import Fissures, {Tier} from '../types/Fissures'
import Formatting, {Platform} from '../utils/Formatting'
import Embed from '../models/Embed'

export default class extends Command {
    constructor(client: Client) {
        super(client)

        this.setDescription('Check current void fissures')
        this.addOptions(
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
        )
    }

    async run(interaction: CommandInteraction) {
        // Defer interaction to wait for API response
        interaction.defer({fetchReply: true})

        // Get data relevant to platform
        let platform = interaction.options.get('platform')?.value as Platform
        let data: Fissures[] = await API.query(`${platform}/fissures`)

        let tier = interaction.options.get('tier')?.value as string | undefined

        // Get custom emoji
        const getEmoji = (name: string) => {
            return this.client.emojis.cache.get(this.client.config.snowflakes.emoji[name])
        }

        let factionEmojis = {
            Grineer: getEmoji('grineer'),
            Corpus: getEmoji('corpus'),
            Infested: getEmoji('infested'),
            Orokin: getEmoji('orokin')
        }

        let relicEmojis = {
            Lith: getEmoji('lith'),
            Meso: getEmoji('meso'),
            Neo: getEmoji('neo'),
            Axi: getEmoji('axi'),
            Requiem: getEmoji('requiem')
        }

        let railjackEmoji = getEmoji('railjack')

        // Get existing fissure tiers
        enum tierNum {
            Lith = 1,
            Meso = 2,
            Neo = 3,
            Axi = 4,
            Requiem = 5
        }

        let existingTiers = Array
            .from(new Set<Tier>(data.map(m => m.tier)))
            .filter(t => tier? (t.toLowerCase() === tier) : true)
            .sort((a, b) => tierNum[a] - tierNum[b])

        // Fulfil deferred interaction
        let emojis = this.client.config.snowflakes.emoji
        
        interaction.followUp({
            embeds: [
                new Embed()
                    .setTitle(`Current Fissure Missions - ${Formatting.getPlatform(platform)}`)
                    .addFields(existingTiers.map(t => {
                        return {
                            name: `${relicEmojis[t]} ${t}`,
                            value: data
                                .filter(m => m.tier === t)
                                .map(m => `${factionEmojis[m.enemy]} ${m.isStorm ? railjackEmoji : ''} ${m.missionType}`)
                                .join('\n')
                        }
                    }))
            ],
            components: [
                new ActionRow()
                    .addComponent(
                        new SelectMenu()
                            .setName('Select fissure tier...')
                            .setCustomId('tier')
                            .addSeveralOptions(
                                new SelectMenuOption('Summary', 'summary')  .setDescription('Get basic information about fissures').setEmoji(emojis.relic),
                                new SelectMenuOption('Lith', 'lith')        .setDescription('Search for all Lith fissures')        .setEmoji(emojis.lith),
                                new SelectMenuOption('Meso', 'meso')        .setDescription('Search for all Meso fissures')        .setEmoji(emojis.meso),
                                new SelectMenuOption('Neo', 'neo')          .setDescription('Search for all Neo fissures')         .setEmoji(emojis.neo),
                                new SelectMenuOption('Axi', 'axi')          .setDescription('Search for all Axi fissures')         .setEmoji(emojis.axi),
                                new SelectMenuOption('Requiem', 'requiem')  .setDescription('Search for all Requiem fissures')     .setEmoji(emojis.requiem),
                                new SelectMenuOption('Railjack', 'railjack').setDescription('Search for all Railjack fissures')    .setEmoji(emojis.railjack)
                            )
                    )
            ]
        })
    }
}