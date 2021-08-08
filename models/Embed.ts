import {MessageEmbed} from 'discord.js'
import quote from '../utils/quote'

/**
 * Create a MessageEmbed.
 */
export default class Embed extends MessageEmbed {
    constructor() {
        super()

        this.setColor('#f6e58d')
        this.setAuthor('Konzu says...', 'https://i.redd.it/tk7edwn1y2031.png', 'https://itsf.in/konzu')
        this.setFooter(quote())
        this.setTimestamp()
    }
}