import {SelectMenuInteraction} from 'discord.js'
import Client from '../models/Client'
import Menu from '../models/Menu'

export default class extends Menu {
    constructor(client: Client) {
        super(client)
    }

    public run(interaction: SelectMenuInteraction) {
        interaction.reply(`Interaction performed: \`${interaction.customId}.${interaction.values[0]}\``)
    }
}