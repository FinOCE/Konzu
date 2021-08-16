import {CommandInteraction} from 'discord.js'
import Client from '../models/Client'
import Command, {CommandOption, CommandOptionChoice} from '../models/Command'
import API from '../utils/API'
import Formatting, {Platform} from '../utils/Formatting'
import Embed from '../models/Embed'

export default class extends Command {
    constructor(client: Client) {
        super(client)

        this.setDescription('Check the current cycle for different open worlds')
        this.addOptions(
            new CommandOption()
                .setName('platform')
                .setDescription('Select the platform you play on')
                .setType('STRING')
                .makeRequired()
                .addChoice(new CommandOptionChoice('PC', 'pc'))
                .addChoice(new CommandOptionChoice('Playstation', 'ps4'))
                .addChoice(new CommandOptionChoice('Xbox', 'xb1'))
                .addChoice(new CommandOptionChoice('Switch', 'swi'))
        )
    }

    async run(interaction: CommandInteraction) {
        // Defer interaction to wait for API response
        interaction.defer()

        // Get data relevant to platform
        let platform = interaction.options.get('platform')?.value as Platform
        let [cetus, vallis, cambion, earth] = await Promise.all([
            API.query(`${platform}/cetusCycle`),
            API.query(`${platform}/vallisCycle`),
            API.query(`${platform}/cambionCycle`),
            API.query(`${platform}/earthCycle`)
        ])

        // Get custom emoji
        let cetusEmoji = this.client.emojis.cache.get(this.client.config.snowflakes.emoji.cetus)
        let solarisEmoji = this.client.emojis.cache.get(this.client.config.snowflakes.emoji.solaris)
        let entratiEmoji = this.client.emojis.cache.get(this.client.config.snowflakes.emoji.entrati)

        // Create MessageEmbed for response
        let embed = new Embed()
            .setTitle(`Current World State - ${Formatting.getPlatform(platform)}`)
            .addFields([{
                name: `${cetusEmoji} Cetus`,
                value: `**${Formatting.capitaliseFirstLetter(cetus.state)}** - changes \`${Formatting.humaniseTimeDifference(cetus.expiry)}\``,
                inline: true
            }, {
                name: `${solarisEmoji} Orb Vallis`,
                value: `**${Formatting.capitaliseFirstLetter(vallis.state)}** - changes \`${Formatting.humaniseTimeDifference(vallis.expiry)}\``,
                inline: true
            }, {
                name: '‎',
                value: '‎',
                inline: false
            }, {
                name: `${entratiEmoji} Cambion Drift`,
                value: `**${Formatting.capitaliseFirstLetter(cambion.active)}** - changes \`${Formatting.humaniseTimeDifference(cambion.expiry)}\``,
                inline: true
            }, {
                name: `🌏 Earth`,
                value: `**${Formatting.capitaliseFirstLetter(earth.state)}** - changes \`${Formatting.humaniseTimeDifference(earth.expiry)}\``,
                inline: true
            }])
        
        // Fulfil deferred interaction
        interaction.followUp({embeds: [embed]})
    }
}