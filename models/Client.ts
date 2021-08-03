import {Client as DJSClient, ClientOptions, Collection} from 'discord.js'
import glob from 'glob-promise'
import {parse} from 'path'
import Event from './Event'
import Command from './Command'
import Button from './Button'

/**
 * Create a client.
 */
export default class Client extends DJSClient {
    public commands: Collection<string, Command>
    public buttons: Collection<string, Button>

    constructor(options: ClientOptions) {
        super(options)

        this.commands = new Collection<string, Command>()
        this.buttons = new Collection<string, Button>()

        {(async () => {
            await this.initialiseEvents()
            await this.login(process.env.token)
            await this.initialiseCommands()
            await this.initialiseButtons()
            console.log('Konzu is ready for lunch!')
        })()}
    }

    /**
     * Initialise bot events.
     */
    private async initialiseEvents(): Promise<void> {
        let files = await glob('./events/*+(js|.ts)')
        
        for (let file of files) {
            let {name} = parse(file)

            let event: Event = new (require(`.${file}`).default)(this)
            this.on(name, (...args) => event.run(...args))
        }
    }
    
    /**
     * Initialise slash commands.
     */
    private async initialiseCommands(): Promise<void> {
        let files = await glob('./commands/*+(js|.ts)')

        for (let file of files) {
            let {name} = parse(file)

            let command: Command = new (require(`.${file}`).default)(this)
            this.commands.set(name, command)

            let {description, options, permissions, defaultPermission} = command
            this.guilds.cache.get(process.env.server!)?.commands.create({
                name,
                description,
                options,
                defaultPermission
            }).then(cmd => {
                if (permissions) cmd.permissions.set({permissions})
            })
        }
    }

    /**
     * Initialise button interactions.
     */
    private async initialiseButtons(): Promise<void> {
        let files = await glob('./commands/*+(js|.ts)')

        for (let file of files) {
            let {name} = parse(file)

            let button: Button = new (require(`.${file}`).default)(this)
            this.buttons.set(name, button)
        }
    }
}