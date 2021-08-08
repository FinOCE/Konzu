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
export class ActionRow extends Component {
    public components: Array<SelectMenu | MenuButton>

    constructor() {
        super()

        this.type = 'ACTION_ROW'
        this.components = []
    }

    /**
     * Add a component to the row.
     */
    public addComponent(component: SelectMenu | MenuButton): ActionRow {
        this.components.push(component)
        return this
    }
}

/**
 *  Create a message select menu.
*/
export class SelectMenu {
    public type: 'SELECT_MENU'
    public options: SelectMenuOption[]
    public custom_id: string
    public min_values: number
    public max_values: number
    public placeholder: string
    public disabled: boolean

    constructor() {
        this.type = 'SELECT_MENU'
        this.options = []
        this.custom_id = 'SELECT_MENU_ID'
        this.min_values = 1
        this.max_values = 1
        this.placeholder = ''
        this.disabled = false
    }

    /**
     * Set the placeholder for a menu.
     */
    public setPlaceholder(placeholder: string): SelectMenu {
        this.placeholder = placeholder
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
        this.min_values = min
        this.max_values = max ? max : min
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
export class SelectMenuOption {}

/**
 * Create a message button.
 */
export class MenuButton {}