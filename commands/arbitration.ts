import {CommandInteraction} from 'discord.js'
import Client from '../models/Client'
import Command, {CommandOption, CommandOptionChoice} from '../models/Command'
import API from '../utils/API'
import Formatting, {Platform} from '../utils/Formatting'
import Embed from '../models/Embed'

export default class extends Command {
    constructor(client: Client) {
        super(client)

        this.setDescription('Check current arbitration mission')
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
        let platform = interaction.options.get('platform')?.value as Platform
        let data = await API.query(`${platform}/arbitration`)

        // Get custom emoji
        let enemyEmoji = this.client.emojis.cache.get(this.client.config.snowflakes.emoji[data.enemy.toLowerCase()])

        // Create MessageEmbed for response
        let embed = new Embed()
            .setTitle(`Current Arbitration Mission - ${Formatting.getPlatform(platform)}`)
            .setDescription([
                `🌏 Node: **${data.node}**`,
                `🗺️ Mission: ${enemyEmoji} **${data.type} (${data.enemy})**`,
                `🕑 Expires: **${Formatting.humaniseTimeDifference(data.expiry)}**`,
                `\n[Click here](https://n8k6e2y6.ssl.hwcdn.net/repos/hnfvc0o3jnfvc873njb03enrf56.html#arbitrations) to view the drop table for arbitrations.`
            ].join('\n'))
        
        // Fulfil deferred interaction
        interaction.followUp({embeds: [embed]})
    }
}