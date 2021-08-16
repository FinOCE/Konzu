import { GuildEmoji } from 'discord.js'
import moment from 'moment'
import Client from '../models/Client'

export type Platform = 'pc' | 'ps4' | 'xb1' | 'swi'

export default class Formatting {
    static getPlatform(platform: Platform) {
        const platforms = {
            'pc': 'PC',
            'ps4': 'Playstation',
            'xb1': 'Xbox',
            'swi': 'Switch'
        }

        return platforms[platform]
    }
    
    /**
     * Capitalise the first letter of a string.
     */
    static capitaliseFirstLetter(string: string) {
        return string[0].toUpperCase() + string.slice(1)
    }

    /**
     * Get the humanised time difference between two times.
     */
    static humaniseTimeDifference(time1: Date | string | number, time2: Date | string | number = Date.now()) {
        return moment.duration(moment(time1).diff(time2)).humanize(true)
    }

    /**
     * Get the humanised time until the given time.
     */
     static humaniseTimeTo(time1: Date | string | number) {
        return moment.duration(moment(time1).diff(Date.now())).humanize()
    }

    /**
     * Get a custom emoji that has its snowflake stored in config.
     */
    static getCustomEmoji(client: Client, name: string): GuildEmoji | undefined {
        return client.emojis.cache.get(client.config.snowflakes.emoji[name.toLowerCase()])
    }
}