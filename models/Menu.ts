import {SelectMenuInteraction} from 'discord.js'
import Client from './Client'
import Interaction from './Interaction'

export default abstract class Menu extends Interaction {
    constructor(client: Client) {
        super(client)
    }

    /**
     * Handle a menu interaction.
     */
    abstract run(interaction: SelectMenuInteraction): void | Promise<void>
}