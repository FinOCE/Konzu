import Client from './Client'

export default abstract class Event {
    client: Client

    constructor(client: Client) {
        this.client = client
    }

    /**
     * Handle an event.
     */
    abstract run(...args: any[]): void | Promise<void>
}