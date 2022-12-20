import type Bot from '../structure/mineflayer/Bot.js';

export default {
    commands: ['mount', 'ride'],
    minArgs: 0,
    maxArgs: 0,
    execute: (user: string, args: any[], bot: Bot) => {
        const nearestBoat = bot.bot.nearestEntity((entity: any) => entity.displayName === "Boat");

         bot.bot.whisper(user, "Searching for nearest boat...")

        if (nearestBoat) {
            bot.bot.mount(nearestBoat);
            return bot.bot.whisper(user, "I mounted the nearest boat!")
        } else {
            return bot.bot.whisper(user, "I could not find a boat.")
        }

    }
 } as MCommand