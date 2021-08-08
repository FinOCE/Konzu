import {MessageActionRow, MessageButton, MessageSelectMenu, MessageSelectOption} from 'discord.js'
import {APIPartialEmoji} from 'discord-api-types/payloads/v9/emoji'

type MessageComponentType = 'ACTION_ROW' | 'BUTTON' | 'SELECT_MENU'
type MessageButtonStyle = 'PRIMARY' | 'SECONDARY' | 'SUCCESS' | 'DANGER' | 'LINK'

// https://discord.com/developers/docs/interactions/message-components#select-menus

/**
 * Create message component.
 */
export default class Component {
    public type?: MessageComponentType
}

/**
 * Create a message action row.
 */
export class ActionRow extends MessageActionRow {
    constructor() {
        super()
    }

    /**
     * Add a component to the row.
     */
    public addComponent(component: SelectMenu): ActionRow {
        this.components.push(component)
        return this
    }
}

/**
 *  Create a message select menu.
*/
export class SelectMenu extends MessageSelectMenu {
    constructor() {
        super()

        this.minValues = 1
        this.maxValues = 1
    }

    /**
     * Set the placeholder for a menu.
     */
    public setName(name: string): SelectMenu {
        this.placeholder = name
        return this
    }

    /**
     * Add a menu option to the select menu.
     */
    public addOption(option: SelectMenuOption): SelectMenu {
        this.options.push(option)
        return this
    }

    /**
     * Set the min/max number of options to choose
     */
    public setChoiceCount(min: number, max?: number): SelectMenu {
        this.minValues = min
        this.maxValues = max ? max : min
        return this
    }

    /**
     * Make the menu disabled.
     */
    public makeDisabled(): SelectMenu {
        this.disabled = true
        return this
    }
}

/**
 * Create a message select menu option.
 */
export class SelectMenuOption implements MessageSelectOption {
    public label: string
    public value: string
    public description: string
    public emoji: APIPartialEmoji
    public default: boolean

    constructor(name: string, value: string) {
        this.label = name
        this.value = value
        this.description = ''
        this.emoji = {
            name: '',
            id: '',
            animated: false
        }
        this.default = false
    }

    public setDescription(description: string): SelectMenuOption {
        this.description = description
        return this
    }

    public setEmoji(emoji: APIPartialEmoji): SelectMenuOption {
        this.emoji = emoji
        return this
    }
}

/**
 * Create a message button.
 */
// export class MenuButton implements MessageButton {}