import {Faction, Mission} from './general'

export type Tier = 'Lith' | 'Meso' | 'Neo' | 'Axi' | 'Requiem'

export type TierOption = Tier | 'Railjack' | 'Summary'

export enum TierNum {
    Lith = 1,
    Meso = 2,
    Neo = 3,
    Axi = 4,
    Requiem = 5
}

export default interface Fissures {
    id: string
    expiry: string
    node: string
    missionType: Mission
    enemy: Faction
    tier: Tier
    tierNum: number
    isStorm: boolean
}