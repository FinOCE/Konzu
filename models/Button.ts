import {MessageComponentInteraction} from 'discord.js'
import Client from './Client'
import Interaction from './Interaction'

export default abstract class Button extends Interaction {
    constructor(client: Client) {
        super(client)
    }

    /**
     * Handle a button interaction.
     */
    abstract run(interaction: MessageComponentInteraction, label?: string): void | Promise<void>
}