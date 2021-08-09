import {MessageComponentInteraction} from 'discord.js'
import Client from '../models/Client'
import Menu from '../models/Menu'

export default class extends Menu {
    constructor(client: Client) {
        super(client)
    }

    public run(interaction: MessageComponentInteraction) {}
}