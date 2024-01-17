import { ForestBotApiClient } from 'forestbot-api';
import type Bot from '../structure/mineflayer/Bot.js';
import { config } from '../config.js';

let isMounted: boolean = false;

export default {
    commands: ['mount', 'ride'],
    description: `Use ${config.prefix}mount to mount the nearest boat.`,
    minArgs: 0,
    maxArgs: 0,
    execute: async (user, args, bot, api: ForestBotApiClient) => {
        const nearestBoat = bot.bot.nearestEntity((entity: any) => entity.displayName === "Boat");

        bot.bot.whisper(user, "Searching for nearest boat...")


        if (isMounted) {
            bot.bot.dismount();
            isMounted = false;
            return bot.bot.whisper(user, "I dismounted the boat.")
        }

        if (nearestBoat && !isMounted) {
            bot.bot.mount(nearestBoat);
            isMounted = true;
            return bot.bot.whisper(user, "I mounted the nearest boat!")
        } else {
            return bot.bot.whisper(user, "I could not find a boat.")
        }

    }
} as MCommand