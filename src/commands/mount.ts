import type Bot from '../structure/mineflayer/Bot.js';
import forestBotAPI from 'forestbot-api-wrapper-v2/build/wrapper.js';
import { Entity } from 'prismarine-entity';

export default {
    commands: ['mount', 'ride'],
    description: 'Mounts the nearest boat entity.',
    minArgs: 0,
    maxArgs: 0,
    execute: async (user: string, args: any[], bot: Bot, api: typeof forestBotAPI): Promise<void> => {
        bot.bot.whisper(user, "Searching for nearest boat...");

        // Find nearest boat
        const nearestBoat = bot.bot.nearestEntity((entity: Entity) =>
            entity.name === 'boat' && entity.isValid && !entity.passengers.includes(bot.bot.entity)
        );

        console.log("Nearest boat entity:", nearestBoat);

        if (!nearestBoat) {
            bot.bot.whisper(user, "I could not find a boat.");
            return;
        }

        try {
            await bot.bot.mount(nearestBoat);
            bot.bot.whisper(user, "I mounted the nearest boat!");
        } catch (err) {
            console.error("Failed to mount:", err);
            bot.bot.whisper(user, "I tried to mount the boat but failed.");
        }
    }
} as MCommand;
