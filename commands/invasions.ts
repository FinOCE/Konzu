import {CommandInteraction} from 'discord.js'
import Client from '../models/Client'
import Command, {CommandOption, CommandOptionChoice} from '../models/Command'
import API from '../utils/API'
import Invasion, {InvasionRewardItem, InvasionSummary} from '../types/Invasion'
import Formatting from '../utils/Formatting'
import {Platform} from '../types/general'
import Embed from '../models/Embed'

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
        // Get data
        let platform = interaction.options.get('platform')?.value as Platform
        let data = await API.query(`${platform}/invasions`) as Invasion[]

        // Get specific planet data
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

        // Create embed fields for planets
        let fields = planets.map(planet => {
            return {
                name: `🪐 ${planet.planet}`,
                value: [
                    `Factions: ${Formatting.getCustomEmoji(this.client, planet.factions[0])} **${planet.factions[0]}** vs ${Formatting.getCustomEmoji(this.client, planet.factions[1])} **${planet.factions[1]}**`,
                    '\n**Available Rewards**',
                    planet.rewards.map(reward => `${reward.count}x ${reward.type}`).join('\n')
                ].join('\n'),
                inline: true
            }
        })

        // Add spacers to force rows of 2
        let i = 0
        while (i < fields.length) {
            if (i % 3 === 2) fields.splice(i, 0, {name: '‎', value: '‎', inline: false}) // Has invisible characters
            i++
        }

        if (i % 3 === 1) fields.push({name: '‎', value: '‎', inline: true}) // Has invisible characters

        // Create embed and respond to interaction
        let embed = new Embed()
            .setTitle(`Current Invasion Status - ${Formatting.getPlatform(platform)}`)
            .setDescription('Available items include possible payouts from both factions.')
            .addFields(fields)
        
        interaction.reply({embeds: [embed]})
    }
}