import dotenv from 'dotenv'
import {Intents} from 'discord.js'
import Client from './models/Client'

dotenv.config()

new Client({intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_VOICE_STATES
]})