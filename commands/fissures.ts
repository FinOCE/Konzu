import {CommandInteraction, MessageEmbed, SelectMenuInteraction, TextChannel} from 'discord.js'
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
                //.addChoice(new CommandOptionChoice('Railjack'))
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
        const displayMission = (mission: Fissures) => {
            return [
                mission.isStorm
                    ? `${Formatting.getCustomEmoji(this.client, mission.enemy)} ${Formatting.getCustomEmoji(this.client, 'railjack')} **${mission.missionType} (${mission.enemy} Railjack)**`
                    : `${Formatting.getCustomEmoji(this.client, mission.enemy)} **${mission.missionType} (${mission.enemy})**`,
                `Located at **${mission.node}** for **${Formatting.humaniseTimeTo(mission.expiry)}**`,
                ''
            ].join('\n')
        }

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
                    .setDescription(
                        data
                            .filter(m => m.tier === tier)
                            .map(m => displayMission(m))
                            .join('\n')
                    )
                
                break;
            
            // Railjack fissures
            // case 'Railjack':
            //     let railjackMissions = data.filter(m => m.isStorm)
            //     let tiersWithMissions = Array
            //         .from(new Set<Tier>(railjackMissions.map(m => m.tier)))
            //     embed = new Embed()
            //         .setTitle(`Current Railjack Fissure Missions - ${Formatting.getPlatform(platform)}`)
            //         .addFields(
            //             tiersWithMissions.sort((a, b) => TierNum[a] - TierNum[b]).map(t => {
            //                 return {
            //                     name: `${Formatting.getCustomEmoji(this.client, t)} ${t}`,
            //                     value: data
            //                         .filter(m => m.tier === t)
            //                         .filter(m => m.isStorm)
            //                         .map(m => displayMission(m))
            //                         .join('\n')
            //                 }
            //             })
            //         )
                
            //     break;

            // Summary of fissures
            case 'Summary':
            default:
                embed = new Embed()
                    .setTitle(`Current Fissure Missions Summary - ${Formatting.getPlatform(platform)}`)
                    .setDescription('To see the available missions for a chosen fissure tier, use the select menu below.')
                    .addFields(
                        (['Lith', 'Meso', 'Neo', 'Axi', 'Requiem'] as Tier[]).sort((a, b) => TierNum[a] - TierNum[b]).map(t => {
                            return {
                                name: `${Formatting.getCustomEmoji(this.client, t)} ${t}`,
                                value: `**${data.filter(m => m.tier === t).length}** available mission${data.filter(m => m.tier === t).length === 1 ? '' : 's'}`,
                                inline: true
                            }
                        })
                    )
                    .addField('‎', '‎', true) // Has invisible characters
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
                                new SelectMenuOption('Summary')
                                    .setDescription('Get basic information about fissures')
                                    .setEmoji(emojis.relic),
                                // new SelectMenuOption('Railjack', 'railjack')
                                //     .setDescription('Search for all Railjack fissures')
                                //     .setEmoji(emojis.railjack),
                                new SelectMenuOption('Lith')
                                    .setDescription('Search for all Lith fissures')
                                    .setEmoji(emojis.lith),
                                new SelectMenuOption('Meso')
                                    .setDescription('Search for all Meso fissures')
                                    .setEmoji(emojis.meso),
                                new SelectMenuOption('Neo')
                                    .setDescription('Search for all Neo fissures')
                                    .setEmoji(emojis.neo),
                                new SelectMenuOption('Axi')
                                    .setDescription('Search for all Axi fissures')
                                    .setEmoji(emojis.axi),
                                new SelectMenuOption('Requiem')
                                    .setDescription('Search for all Requiem fissures')
                                    .setEmoji(emojis.requiem)
                            )
                    )
            ]
        })
    }

    static async update(client: Client, interaction: SelectMenuInteraction, platform: Platform, tier: TierOption) {
        // Get data relevant to platform
        let data: Fissures[] = await API.query(`${platform}/fissures`)

        // Create embed relevant to selection
        const displayMission = (mission: Fissures) => {
            return [
                mission.isStorm
                    ? `${Formatting.getCustomEmoji(client, mission.enemy)} ${Formatting.getCustomEmoji(client, 'railjack')} **${mission.missionType} (${mission.enemy} Railjack)**`
                    : `${Formatting.getCustomEmoji(client, mission.enemy)} **${mission.missionType} (${mission.enemy})**`,
                `Located at **${mission.node}** for **${Formatting.humaniseTimeTo(mission.expiry)}**`,
                ''
            ].join('\n')
        }

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
                    .setDescription(
                        data
                            .filter(m => m.tier === tier)
                            .map(m => displayMission(m))
                            .join('\n')
                    )
                
                break;

            // Summary of fissures
            case 'Summary':
            default:
                embed = new Embed()
                    .setTitle(`Current Fissure Missions Summary - ${Formatting.getPlatform(platform)}`)
                    .setDescription('To see the available missions for a chosen fissure tier, use the select menu below.')
                    .addFields(
                        (['Lith', 'Meso', 'Neo', 'Axi', 'Requiem'] as Tier[]).sort((a, b) => TierNum[a] - TierNum[b]).map(t => {
                            return {
                                name: `${Formatting.getCustomEmoji(client, t)} ${t}`,
                                value: `**${data.filter(m => m.tier === t).length}** available mission${data.filter(m => m.tier === t).length === 1 ? '' : 's'}`,
                                inline: true
                            }
                        })
                    )
                    .addField('‎', '‎', true) // Has invisible characters
                break;
        }

        // Fulfil deferred interaction
        console.log(`updated ${platform} ${tier}`);
        // (client.channels.cache.get(interaction.channelId!) as TextChannel)?.messages.cache.get(interaction.message.id)?.edit({embeds: [embed]}).then(() => {
            
        // })
        interaction.update({embeds: [embed]})
    }
}