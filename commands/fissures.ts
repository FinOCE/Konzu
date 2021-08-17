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
        let tier = interaction.options.get('tier')?.value as TierOption ?? 'Summary'
        let data: Fissures[] = await API.query(`${platform}/fissures`)

        // Fulfil deferred interaction
        interaction.followUp({
            embeds: [FissureCommandUtils.createEmbed(this.client, platform, tier, data)],
            components: [
                new ActionRow()
                    .addComponent(
                        new SelectMenu()
                            .setName('Select fissure tier...')
                            .setCustomId('tier')
                            .addSeveralOptions(
                                new SelectMenuOption('Summary')
                                    .setDescription('Get basic information about fissures')
                                    .setEmoji(this.client.config.snowflakes.emoji.relic),
                                new SelectMenuOption('Lith')
                                    .setDescription('Search for all Lith fissures')
                                    .setEmoji(this.client.config.snowflakes.emoji.lith),
                                new SelectMenuOption('Meso')
                                    .setDescription('Search for all Meso fissures')
                                    .setEmoji(this.client.config.snowflakes.emoji.meso),
                                new SelectMenuOption('Neo')
                                    .setDescription('Search for all Neo fissures')
                                    .setEmoji(this.client.config.snowflakes.emoji.neo),
                                new SelectMenuOption('Axi')
                                    .setDescription('Search for all Axi fissures')
                                    .setEmoji(this.client.config.snowflakes.emoji.axi),
                                new SelectMenuOption('Requiem')
                                    .setDescription('Search for all Requiem fissures')
                                    .setEmoji(this.client.config.snowflakes.emoji.requiem)
                            )
                    )
            ]
        })
    }
}

export class FissureCommandUtils {
    /**
     * Update a fissure embed with new tier data.
     */
    public static async update(client: Client, interaction: SelectMenuInteraction, platform: Platform, tier: TierOption) {
        // Get data relevant to platform
        let data: Fissures[] = await API.query(`${platform}/fissures`)

        // Fulfil deferred interaction
        interaction.update({embeds: [this.createEmbed(client, platform, tier, data)]})
    }

    /**
     * Format a mission to be displayed as fissure mission.
     */
    public static displayMission(client: Client, mission: Fissures) {
        return [
            mission.isStorm
                ? `${Formatting.getCustomEmoji(client, mission.enemy)} ${Formatting.getCustomEmoji(client, 'railjack')} **${mission.missionType} (${mission.enemy} Railjack)**`
                : `${Formatting.getCustomEmoji(client, mission.enemy)} **${mission.missionType} (${mission.enemy})**`,
            `Located at **${mission.node}** for **${Formatting.humaniseTimeTo(mission.expiry)}**`,
            ''
        ].join('\n')
    }

    /**
     * Create an embed to display fissure data.
     */
    public static createEmbed(client: Client, platform: Platform, tier: TierOption, data: Fissures[]) {
        let embed: MessageEmbed

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
                            .map(m => this.displayMission(client, m))
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

        return embed
    }
}