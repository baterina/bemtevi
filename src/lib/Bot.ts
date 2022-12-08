import fs from 'node:fs/promises'
import path from 'node:path'
import { Client, GatewayIntentBits } from 'discord.js'
import yaml from 'yaml'
import { Config } from '../types/config'

export class Bot extends Client {
    config: Config = {
        blacklist: [] as string[],
        chance: {
            normal: 30,
            estourado: 5,
        },
    }

    constructor() {
        super({
            intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates],
        })
    }

    async loadConfig() {
        const filePath = path.join(__dirname, '..', '..', 'config.yml')
        const configFile = await fs.readFile(filePath, 'utf-8')

        this.config = yaml.parse(configFile)
    }

    async loadEvents() {
        const dir = path.join(__dirname, '..', 'events')
        const files = await fs.readdir(dir)

        for (let file of files) {
            const [name] = file.split('.')
            const { default: fn } = require(path.join(dir, file))

            this.on(name, fn)
        }
    }

    async start() {
        const token = process.env.TOKEN!

        await this.loadConfig()
        await this.loadEvents()
        await super.login(token)

        console.log('Logged in!')
    }
}
