import type Bot from '../structure/mineflayer/Bot.js';
import { config } from '../config.js';
import forestBotAPI from 'forestbot-api-wrapper-v2/build/wrapper.js';

let isMounted: boolean = false;

export default {
    commands: ['mount', 'ride'],
    description: '🤖 Mounts the nearest boat entity.',
    minArgs: 0,
    maxArgs: 0,
    execute: async (user: string, args: any[], bot: Bot, api: typeof forestBotAPI): Promise<void> => {
        const nearestBoat = bot.bot.nearestEntity((entity: any) => entity.displayName === "Boat");

        bot.bot.whisper(user, "Searching for nearest boat...");
        console.log("🤖 Nearest boat entity:", nearestBoat);

        if (nearestBoat) {
            bot.bot.mount(nearestBoat);
            bot.bot.whisper(user, "🤖 I mounted the nearest boat!");
        } else {
            bot.bot.whisper(user, "🤖 I could not find a boat.");
        }
    }
 } as MCommand