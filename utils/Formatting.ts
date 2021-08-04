import moment from 'moment'

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
}