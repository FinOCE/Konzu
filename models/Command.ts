import {ApplicationCommandData, ApplicationCommandOptionChoice, ApplicationCommandOptionData, ApplicationCommandOptionType, ApplicationCommandPermissionData, CommandInteraction, PermissionString} from 'discord.js'
import Client from './Client'
import Interaction from './Interaction'

/**
 * Create a slash command.
 */
export default abstract class Command extends Interaction {
    public description: string
    public defaultPermission: boolean
    public permissions?: Array<ApplicationCommandPermissionData>
    public options?: Array<ApplicationCommandOptionData>

    constructor(client: Client) {
        super(client)

        this.description = ''
        this.defaultPermission = true
    }

    /**
     * Handle a command interaction.
     */
    abstract run(interaction: CommandInteraction): void | Promise<void>

    /**
     * Set the description of the command.
     */
    public setDescription(description: string): void {
        this.description = description
    }

    /**
     * Only allow the command to be used by users with specific permissions.
     */
    public onlyAllowWithPerms(permissions: PermissionString[]): void {
        this.defaultPermission = true
        this.permissions = []

        let roles = this.client.guilds.cache.get(this.client.config.snowflakes.server)?.roles.cache.filter(role => role.permissions.any(permissions)) ?? []

        for (let [name, role] of roles) {
            this.permissions.push({
                id: role.id,
                type: 'ROLE',
                permission: true
            })
        }
    }

    /**
     * Add arguments to the command.
     */
    public addOptions(options: CommandOption[]): void {
        this.options = []

        for (let option of options) {
            this.options.push(option)
        }
    }
}

/**
 * Create a slash command option.
 */
export class CommandOption implements ApplicationCommandData {
    public name: string
    public description: string
    public type: ApplicationCommandOptionType
    public required: boolean
    public choices: ApplicationCommandOptionChoice[]

    constructor() {
        this.name = ''
        this.description = ''
        this.type = 'STRING'
        this.required = false
        this.choices = []
    }

    public setName(name: string): CommandOption {
        this.name = name
        return this
    }

    public setDescription(description: string): CommandOption {
        this.description = description
        return this
    }

    public setType(type: ApplicationCommandOptionType): CommandOption {
        this.type = type
        return this
    }

    public makeRequired(): CommandOption {
        this.required = true
        return this
    }

    public addChoice(choice: CommandOptionChoice): CommandOption {
        this.choices.push(choice)
        return this
    }
}

/**
 * Create a slash command option choice.
 */
export class CommandOptionChoice implements ApplicationCommandOptionChoice {
    public name: string
    public value: number | string

    constructor(name: string, value: number | string) {
        this.name = name
        this.value = value
    }
}