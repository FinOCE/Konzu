import {MessageComponentInteraction} from 'discord.js'
import Client from '../models/Client'
import Event from '../models/Event'

export default class extends Event {
    constructor(client: Client) {
        super(client)
    }

    async run(interaction: MessageComponentInteraction) {
        if (interaction.isCommand()) {
            let command = this.client.commands.get(interaction.commandName)

            if (!command) {
                this.client.guilds.cache.get(process.env.server!)?.commands.delete(interaction.commandId)
                interaction.reply('This command no longer exists! Deleting now...')
                setTimeout(() => interaction.deleteReply(), 2000)
                return
            }

            try {
                command.run(interaction)
            } catch(err) {
                interaction.reply('Something went wrong trying to run this command.')
                console.log(err)
            }
        }
    }
}