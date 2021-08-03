import {CommandInteraction, MessageEmbed} from 'discord.js'
import moment from 'moment'
import Client from '../models/Client'
import Command, {CommandOption, CommandOptionChoice} from '../models/Command'
import API from '../utils/API'
import quote from '../utils/quote'

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
        let platform = interaction.options.get('platform')?.value as 'pc' | 'ps4' | 'xb1' | 'swi'
        let data = await API.query(`${platform}/arbitration`)

        // Rename platform to what was used in CommandOptionChoice for response
        const platforms = {
            'pc': 'PC',
            'ps4': 'Playstation',
            'xb1': 'Xbox',
            'swi': 'Switch'
        }

        // Create MessageEmbed for response
        let embed = new MessageEmbed()
            .setColor(this.client.config.embed.color)
            .setAuthor(this.client.config.embed.author.name, this.client.config.embed.author.image, this.client.config.embed.author.url)
            .setFooter(quote())
            .setTitle(`Current Arbitration Mission - ${platforms[platform]}`)
            .setURL('https://n8k6e2y6.ssl.hwcdn.net/repos/hnfvc0o3jnfvc873njb03enrf56.html#arbitrations')
            .setDescription([
                `🌏 Node: **${data.node}**`,
                `🗺️ Mission: **${data.type} (${data.enemy})**`,
                `🕑 Expires: **${moment.duration(moment(data.expiry).diff(Date.now())).humanize(true)}**`,
                `\n[Click here](https://n8k6e2y6.ssl.hwcdn.net/repos/hnfvc0o3jnfvc873njb03enrf56.html#arbitrations) to view the drop table for arbitrations.`
            ].join('\n'))
        
        // Fulfil deferred interaction
        interaction.followUp({embeds: [embed]})
    }
}