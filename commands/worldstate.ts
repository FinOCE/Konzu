import {CommandInteraction, MessageEmbed} from 'discord.js'
import Client from '../models/Client'
import Command, {CommandOption, CommandOptionChoice} from '../models/Command'
import API from '../utils/API'
import quote from '../utils/quote'
import Formatting, {Platform} from '../utils/Formatting'

export default class extends Command {
    constructor(client: Client) {
        super(client)

        this.setDescription('Check the current cycle for different open worlds')
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
        interaction.defer()

        // Get data relevant to platform
        let platform = interaction.options.get('platform')?.value as Platform
        let [cetus, vallis, cambion, earth] = await Promise.all([
            API.query(`${platform}/cetusCycle`),
            API.query(`${platform}/vallisCycle`),
            API.query(`${platform}/cambionCycle`),
            API.query(`${platform}/earthCycle`)
        ])

        // Create MessageEmbed for response
        let embed = new MessageEmbed()
            .setColor(this.client.config.embed.color)
            .setAuthor(this.client.config.embed.author.name, this.client.config.embed.author.image, this.client.config.embed.author.url)
            .setFooter(quote())
            .setTitle(`Current World State - ${Formatting.getPlatform(platform)}`)
            .setDescription([
                `Cetus: **${Formatting.capitaliseFirstLetter(cetus.state)}**\n*expires **${Formatting.humaniseTimeDifference(cetus.expiry)}***\n`,
                `Orb Vallis: **${Formatting.capitaliseFirstLetter(vallis.state)}**\n*expires **${Formatting.humaniseTimeDifference(vallis.expiry)}***\n`,
                `Cambion Drift: **${Formatting.capitaliseFirstLetter(cambion.active)}**\n*expires **${Formatting.humaniseTimeDifference(cambion.expiry)}***\n`,
                `Earth: **${Formatting.capitaliseFirstLetter(earth.state)}**\n*expires **${Formatting.humaniseTimeDifference(earth.expiry)}***\n`
            ].join('\n'))
        
        // Fulfil deferred interaction
        interaction.followUp({embeds: [embed]})
    }
}