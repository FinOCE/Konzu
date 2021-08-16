import {MessageEmbed, SelectMenuInteraction, TextChannel} from 'discord.js'
import Client from '../models/Client'
import Menu from '../models/Menu'

export default class extends Menu {
    constructor(client: Client) {
        super(client)
    }

    public run(interaction: SelectMenuInteraction) {
        (this.client.channels.cache.get(interaction.channelId!) as TextChannel)?.messages.cache.get(interaction.message.id)?.edit({embeds: [
            new MessageEmbed()
                .setDescription(`Interaction performed: \`${interaction.customId}.${interaction.values[0]}\``)
        ]})
        interaction.update({fetchReply: false})
    }
}