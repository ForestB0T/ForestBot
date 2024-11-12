import type Bot from '../structure/mineflayer/Bot.js';
import { config } from '../config.js';
import forestBotAPI from 'forestbot-api-wrapper-v2/build/wrapper.js';

let isMounted: boolean = false;

export default {
    commands: ['mount', 'ride'],
    description: `Use ${config.prefix}mount to mount the nearest boat.`,
    minArgs: 0,
    maxArgs: 0,
    execute: async (user, args, bot, api: forestBotAPI) => {
        const nearestBoat = bot.bot.nearestEntity((entity: any) => entity.displayName === "Boat");

        bot.Whisper(user, "Searching for nearest boat...")


        if (isMounted) {
            bot.bot.dismount();
            isMounted = false;
            return bot.Whisper(user, "I dismounted the boat.")
        }

        if (nearestBoat && !isMounted) {
            bot.bot.mount(nearestBoat);
            isMounted = true;
            return bot.Whisper(user, "I mounted the nearest boat!")
        } else {
            return bot.Whisper(user, "I could not find a boat.")
        }

    }
} as MCommand