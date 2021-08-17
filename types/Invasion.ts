import {Faction, Mission} from './general'

export default interface Invasion {
    node: string
    desc: Mission
    vsInfestation: boolean
    count: number
    requiredRuns: number
    attacker: InvasionFaction
    defender: InvasionFaction
}

export interface InvasionFaction {
    faction: Faction
    reward: InvasionReward
}

export interface InvasionReward {
    itemString: string
    thumbnail: string
    countedItems: InvasionRewardItem[]
}

export interface InvasionRewardItem {
    count: number
    type: string
}

export interface InvasionSummary {
    rewards: InvasionRewardItem[]
    planet: string
    factions: [Faction, Faction]
}