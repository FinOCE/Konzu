import {CommandInteraction} from 'discord.js'
import Client from '../models/Client'
import Command, {CommandOption, CommandOptionChoice} from '../models/Command'
import API from '../utils/API'

export default class extends Command {
    constructor(client: Client) {
        super(client)

        this.setDescription('Check latest alerts')
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
        let platform = interaction.options.get('platform')?.value as string
        let data = await API.query(`${platform}/alerts`)
        interaction.reply(`\`\`\`\n${JSON.stringify(data, null, 4)}\n\`\`\``)
    }
}