import path from 'node:path'
import { VoiceState } from 'discord.js'
import {
    AudioPlayerStatus,
    createAudioPlayer,
    createAudioResource,
    joinVoiceChannel,
    NoSubscriberBehavior,
} from '@discordjs/voice'

import { Bot } from '../lib/Bot'

export default function run(this: Bot, oldState: VoiceState, newState: VoiceState) {
    if (newState.channelId !== null && oldState.channelId !== newState.channelId) {
        // user joined channel

        if (this.config?.blacklist.includes(newState.channelId)) {
            // channel is blacklisted
            return
        }

        const chance = Math.random() * 100

        if (chance <= this.config.chance.normal) {
            const connection = joinVoiceChannel({
                channelId: newState.channelId,
                guildId: newState.guild.id,
                adapterCreator: newState.guild.voiceAdapterCreator,
            })
            const player = createAudioPlayer({
                behaviors: {
                    noSubscriber: NoSubscriberBehavior.Pause,
                },
            })

            connection.subscribe(player)
            
            // normal
            let resourcePath = path.join(__dirname, '..', '..', 'assets', 'bemtevi.mp3')

            if (chance <= this.config.chance.estourado) {
                // estourado
                resourcePath = path.join(__dirname, '..', '..', 'assets', 'bemtevi-estourado.mp3')
            }

            const resource = createAudioResource(resourcePath)
            
            player.play(resource)

            player.on(AudioPlayerStatus.Idle, () => {
                connection.destroy()
            })
        }
    }
}
