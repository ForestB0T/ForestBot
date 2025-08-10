import type Bot from "../../structure/mineflayer/Bot.js";
import { Logger } from "../../index.js";
import { BotEvents } from "mineflayer";

export default {
    name: 'kicked',
    once: false,
    run: async (content: BotEvents, Bot: Bot) => {
        // Convert the kick reason to a readable JSON string
        let kickInfo: string;

        try {
            kickInfo = JSON.stringify(content, null, 2); // pretty print
        } catch (err) {
            // Fallback in case there's a circular structure
            kickInfo = require('util').inspect(content, { depth: null, colors: false });
        }

        Logger.kick(`[kick] - ${kickInfo}`);
        console.log("Kicked content:", kickInfo);

        Bot.bot.end();
    }
};
