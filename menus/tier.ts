import {SelectMenuInteraction} from 'discord.js'
import Client from '../models/Client'
import Menu from '../models/Menu'
import {FissureCommandUtils} from '../commands/fissures'
import {TierOption} from '../types/Fissures'

export default class extends Menu {
    constructor(client: Client) {
        super(client)
    }

    public async run(interaction: SelectMenuInteraction) {
        await FissureCommandUtils.update(this.client, interaction, 'pc', interaction.values[0] as TierOption)
    }
}