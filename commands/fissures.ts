import {CommandInteraction, MessageEmbed} from 'discord.js'
import Client from '../models/Client'
import Command, {CommandOption, CommandOptionChoice} from '../models/Command'
import {ActionRow, SelectMenu, SelectMenuOption} from '../models/Component'
import API from '../utils/API'
import Fissures, {Tier, TierNum, TierOption} from '../types/Fissures'
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
                .addChoice(new CommandOptionChoice('Railjack'))
                .addChoice(new CommandOptionChoice('Lith'))
                .addChoice(new CommandOptionChoice('Meso'))
                .addChoice(new CommandOptionChoice('Neo'))
                .addChoice(new CommandOptionChoice('Axi'))
                .addChoice(new CommandOptionChoice('Requiem'))
        )
    }

    async run(interaction: CommandInteraction) {
        // Defer interaction to wait for API response
        interaction.defer({fetchReply: true})

        // Get data relevant to platform
        let platform = interaction.options.get('platform')?.value as Platform
        let data: Fissures[] = await API.query(`${platform}/fissures`)
        let tier = interaction.options.get('tier')?.value as TierOption ?? 'Summary'

        // Create embed relevant to selection
        let embed: MessageEmbed;

        switch (tier) {
            // Specific fissures
            case 'Lith':
            case 'Meso':
            case 'Neo':
            case 'Axi':
            case 'Requiem':
                embed = new Embed()
                    .setTitle(`Current ${tier} Fissure Missions - ${Formatting.getPlatform(platform)}`)
                    .addField(
                        `${Formatting.getCustomEmoji(this.client, tier)} ${tier}`,
                        data
                            .filter(m => m.tier === tier)
                            .map(m => `${Formatting.getCustomEmoji(this.client, m.enemy)} ${m.isStorm ? Formatting.getCustomEmoji(this.client, 'railjack') : ''} ${m.missionType}`)
                            .join('\n')
                    )
                
                break;
            
            // Railjack fissures
            case 'Railjack':
                embed = new Embed()
                    .setTitle(`Current Railjack Fissure Missions - ${Formatting.getPlatform(platform)}`)
                    .addFields(
                        Array
                            .from(new Set<Tier>(data.map(m => m.tier)))
                            .sort((a, b) => TierNum[a] - TierNum[b]).map(t => {
                                return {
                                    name: `${Formatting.getCustomEmoji(this.client, t)} ${t}`,
                                    value: '. ' + data
                                        .filter(m => m.tier === t)
                                        .filter(m => m.isStorm)
                                        .map(m => `${Formatting.getCustomEmoji(this.client, m.enemy)} ${m.isStorm ? Formatting.getCustomEmoji(this.client, 'railjack') : ''} ${m.missionType}`)
                                        .join('\n')
                                }
                            })
                    )
                
                break;

            // Summary of fissures
            case 'Summary':
            default:
                embed = new Embed()
                    .setTitle(`Current Fissure Missions Summary - ${Formatting.getPlatform(platform)}`)
                    .addFields(
                        Array
                            .from(new Set<Tier>(data.map(m => m.tier)))
                            .sort((a, b) => TierNum[a] - TierNum[b]).map(t => {
                                return {
                                    name: `${Formatting.getCustomEmoji(this.client, t)} ${t}`,
                                    value: `${data.filter(m => m.tier === t).length} missions`
                                }
                            })
                    )
                break;
        }

        // Fulfil deferred interaction
        let emojis = this.client.config.snowflakes.emoji

        interaction.followUp({
            embeds: [embed],
            components: [
                new ActionRow()
                    .addComponent(
                        new SelectMenu()
                            .setName('Select fissure tier...')
                            .setCustomId('tier')
                            .addSeveralOptions(
                                new SelectMenuOption('Summary', 'summary')  .setDescription('Get basic information about fissures').setEmoji(emojis.relic),     // Summary
                                new SelectMenuOption('Railjack', 'railjack').setDescription('Search for all Railjack fissures')    .setEmoji(emojis.railjack),  // Railjack
                                new SelectMenuOption('Lith', 'lith')        .setDescription('Search for all Lith fissures')        .setEmoji(emojis.lith),      // Lith
                                new SelectMenuOption('Meso', 'meso')        .setDescription('Search for all Meso fissures')        .setEmoji(emojis.meso),      // Meso
                                new SelectMenuOption('Neo', 'neo')          .setDescription('Search for all Neo fissures')         .setEmoji(emojis.neo),       // Neo
                                new SelectMenuOption('Axi', 'axi')          .setDescription('Search for all Axi fissures')         .setEmoji(emojis.axi),       // Axi
                                new SelectMenuOption('Requiem', 'requiem')  .setDescription('Search for all Requiem fissures')     .setEmoji(emojis.requiem)    // Requiem
                            )
                    )
            ]
        })
    }
}