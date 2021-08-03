import {CommandInteraction, MessageEmbed} from 'discord.js'
import moment from 'moment'
import Client from '../models/Client'
import Command, {CommandOption, CommandOptionChoice} from '../models/Command'
import API from '../utils/API'

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
        let startTime = Date.now()
        interaction.defer({fetchReply: true})

        let platform = interaction.options.get('platform')?.value as string
        let data = await API.query(`${platform}/arbitration`)

        let embed = new MessageEmbed()
            .setColor('#74b9ff')
            .setAuthor('Konzu', '', 'https://itsf.in/konzu')
            .setFooter(`Request time: ${Date.now() - startTime}ms`)
            .setTitle('Current Arbitration Mission')
            .setDescription([
                `Mission type: **${data.type}**`,
                `Planet: **${data.node.split('(')[1].slice(0, -1)}**`,
                `Node: **${data.node.split('(')[0].slice(0, -1)}**`,
                `Faction: **${data.enemy}**`,
                `Expires: **${moment.duration(moment(data.expiry).diff(Date.now())).humanize(true)}**`
            ].join('\n'))
        
        interaction.followUp({embeds: [embed]})
    }
}