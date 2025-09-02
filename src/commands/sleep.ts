import type Bot from '../structure/mineflayer/Bot.js';
import { config } from '../config.js';

export default {
    commands: ['sleep'],
    description: `🤖 Put the bot to sleep. Usage: ${config.prefix}sleep`,
    minArgs: 0,
    maxArgs: 1,
    execute: async (user, args, bot: Bot, api) => {

        const bed = bot.bot.findBlock({
            matching: block => bot.bot.isABed(block)
        })

        if (bed) {
            try {
                await bot.bot.activateBlock(bed);
                bot.Whisper(user, "🤖 goodnight zzz")
            } catch (err) {
                return console.log(err, " activation error")
            }
        } else {
            return bot.bot.chat("🤖 I couldn't find a bed :(")
        }

        return
    }
} as MCommand