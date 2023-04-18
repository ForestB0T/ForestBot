import { ForestBotApiClient } from 'forestbot-api';
import type Bot from '../structure/mineflayer/Bot.js';

let isMounted: boolean = false;

export default {
    commands: ['mount', 'ride'],
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