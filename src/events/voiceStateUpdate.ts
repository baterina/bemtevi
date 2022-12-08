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
    if (oldState.channelId !== newState.channelId && newState.channelId !== null) {
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

            if (chance <= this.config.chance.estourado) {
                // estourado
                const resource = createAudioResource(
                    path.join(__dirname, '..', '..', 'assets', 'bemtevi-estourado.mp3')
                )

                player.play(resource)
            } else {
                const resource = createAudioResource(path.join(__dirname, '..', '..', 'assets', 'bemtevi.mp3'))

                player.play(resource)
            }

            player.on(AudioPlayerStatus.Idle, () => {
                connection.destroy()
            })
        }
    }
}
