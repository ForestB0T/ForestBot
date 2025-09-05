import type Bot from '../structure/mineflayer/Bot.js';
import forestBotAPI from 'forestbot-api-wrapper-v2/build/wrapper.js';

export default {
    commands: ['mount', 'ride'],
    description: 'Activate the nearest boat entity.',
    minArgs: 0,
    maxArgs: 0,
    execute: async (user: string, args: any[], bot: Bot, api: typeof forestBotAPI): Promise<void> => {
        bot.bot.whisper(user, "Searching for nearest boat...");

        const nearestBoat = bot.bot.nearestEntity((entity: any) =>
            entity.kind === "Vehicles"
        );

        console.log("Nearest boat:", nearestBoat);

        if (!nearestBoat) {
            bot.bot.whisper(user, "I could not find a boat nearby.");
            return;
        }

        await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 1 second before activating 

        try {
            await bot.bot.mount(nearestBoat);
            bot.bot.whisper(user, "I activated the boat!");
        } catch (err) {
            console.error("Failed to activate:", err);
            bot.bot.whisper(user, "I tried to activate the boat but failed.");
        }
    }
} as MCommand;
