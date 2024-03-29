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
                this.client.guilds.cache.get(this.client.config.snowflakes.server)?.commands.delete(interaction.commandId)
                interaction.reply('This command no longer exists! Deleting now...')
                setTimeout(() => interaction.deleteReply(), 2000)
                return
            }

            command.run(interaction)
        }

        if (interaction.isSelectMenu()) {
            let menu = this.client.menus.get(interaction.customId)
            if (!menu) return

            menu.run(interaction)
        }
    }
}