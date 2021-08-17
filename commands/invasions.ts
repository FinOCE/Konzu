import {CommandInteraction} from 'discord.js'
import Client from '../models/Client'
import Command, {CommandOption, CommandOptionChoice} from '../models/Command'
import API from '../utils/API'
import Invasion, { InvasionReward, InvasionRewardItem, InvasionSummary } from '../types/Invasion'
import Formatting from '../utils/Formatting'

export default class extends Command {
    constructor(client: Client) {
        super(client)

        this.setDescription('Check current invasions')
        this.addOptions(
            new CommandOption()
                .setName('platform')
                .setDescription('Select the platform you play on')
                .setType('STRING')
                .makeRequired()
                .addChoice(new CommandOptionChoice('PC', 'pc'))
                .addChoice(new CommandOptionChoice('Playstation', 'ps4'))
                .addChoice(new CommandOptionChoice('Xbox', 'xb1'))
                .addChoice(new CommandOptionChoice('Switch', 'swi'))
        )
    }

    async run(interaction: CommandInteraction) {
        let platform = interaction.options.get('platform')?.value as string
        let data = await API.query(`${platform}/invasions`) as Invasion[]

        let planets: InvasionSummary[] = []

        for (let planet of new Set<string>(data.map(i => i.node.split('(')[1].split(')')[0]))) {
            let invasions = data.filter(i => i.node.includes(planet))
            let rewards: InvasionRewardItem[] = []

            for (let invasion of invasions) {
                for (let item of invasion.attacker.reward.countedItems.concat(invasion.defender.reward.countedItems)) {
                    let existingItem = rewards.find(i => i.type === item.type)
                    if (existingItem) existingItem.count += item.count
                    else rewards.push(item)
                }
            }

            planets.push({
                planet,
                rewards,
                factions: [
                    invasions[0].attacker.faction,
                    invasions[0].defender.faction
                ]
            })
        }

        interaction.reply(planets.map(planet => {
            return [
                `Planet: **${planet.planet}**`,
                `Factions: ${Formatting.getCustomEmoji(this.client, planet.factions[0])} ${planet.factions[0]} vs ${Formatting.getCustomEmoji(this.client, planet.factions[1])} ${planet.factions[1]}`,
                `**Available Rewards**`,
                planet.rewards.map(reward => `${reward.count}x ${reward.type}`).join('\n')
            ].join('\n')
        }).join('\n\n'))

        // interaction.reply(invasions.map(i => {return [
        //     `${Formatting.getCustomEmoji(this.client, i.attacker.faction)} **${i.attacker.faction}** vs ${Formatting.getCustomEmoji(this.client, i.defender.faction)} **${i.defender.faction}**`,
        //     `**Available rewards**\n${
        //         data
        //             .filter(ii => ii.node.includes(i.node.split('(')[1].split(')')[0]))
        //             .map(ii => `${ii.attacker.reward.itemString} or ${ii.defender.reward.itemString}`)
        //             .join('\n')
        //     }`
        // ].join('\n')}).join('\n\n'))

        // interaction.reply(data.map(i => {
        //     if (i.vsInfestation) {
        //         let faction = i.attacker.faction === 'Infested' ? i.defender : i.attacker
        //         return [
        //             `${Formatting.getCustomEmoji(this.client, 'Infested')} **Infested** vs ${Formatting.getCustomEmoji(this.client, faction.faction)} **${faction.faction}**`,
        //             `for **${faction.reward.itemString}**`,
        //             `**${i.desc}**`
        //         ].join('\n')
        //     } else return [
        //         `${Formatting.getCustomEmoji(this.client, i.attacker.faction)} **${i.attacker.faction}** vs ${Formatting.getCustomEmoji(this.client, i.defender.faction)} **${i.defender.faction}**`,
        //         `**${i.attacker.reward.itemString}** or **${i.defender.reward.itemString}**`,
        //         `**${i.desc}**`
        //     ].join('\n')
        // }).join('\n\n'))
    }
}