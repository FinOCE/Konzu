import {Interaction as DJSInteraction} from 'discord.js'
import Client from './Client'

export default abstract class Interaction {
    public client: Client

    constructor(client: Client) {
        this.client = client
    }

    /**
     * Handle an interaction.
     */
    abstract run(interaction: DJSInteraction): void | Promise<void>
}