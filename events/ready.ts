import Client from '../models/Client'
import Event from '../models/Event'

export default class extends Event {
    constructor(client: Client) {
        super(client)
    }

    async run() {
        this.client.user?.setActivity('over Cetus 🌏', {type: 'WATCHING'})
    }
}