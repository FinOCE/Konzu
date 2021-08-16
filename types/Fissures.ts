export type Tier = 'Lith' | 'Meso' | 'Neo' | 'Axi' | 'Requiem'

export type TierOption = Tier | 'Railjack' | 'Summary'

export enum TierNum {
    Lith = 1,
    Meso = 2,
    Neo = 3,
    Axi = 4,
    Requiem = 5
}

export type Faction = 'Grineer' | 'Corpus' | 'Infested' | 'Orokin'

// Some mission types are not used for fissures, this is just all the mission types listed at https://warframe.fandom.com/wiki/Mission
export type Mission = 'Arena'          | 'Assassination'  | 'Assault'   | 'Capture'  | 'Defection'        | 'Defense'             | 'Disruption'
                    | 'Excavation'     | 'Exterminate'    | 'Free Roam' | 'Hijack'   | 'Infested Salvage' | 'Interception'        | 'Junction'
                    | 'Mobile Defense' | 'Persuit'        | 'Rescue'    | 'Rush'     | 'Sabotage'         | 'Sanctuary Onslaught'
                    | 'Skirmish'       | 'Spy'            | 'Survival'  | 'Volatile'

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