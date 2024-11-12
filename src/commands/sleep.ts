import type Bot from '../structure/mineflayer/Bot.js';
import { config } from '../config.js';

export default {
    commands: ['sleep'],
    description: `Use ${config.prefix}sleep to get the bot to sleep.`,
    minArgs: 0,
    maxArgs: 1,
    execute: async (user, args, bot, api) => {

        const bed = bot.bot.findBlock({
            matching: block => bot.bot.isABed(block)
        })

        if (bed) {
            try {
                await bot.bot.sleep(bed);
                bot.bot.chat("Goodnight! Zzz")
            } catch (err) {
                return
            }
        } else {
            return bot.bot.chat("I couldn't find a bed :(")
        }

        return
    }
 } as MCommand