import type Bot      from '../../structure/mineflayer/Bot.js';
import { BotEvents } from 'mineflayer';
import { logger } from "../../index.js";

export default {
    name: "error",
    once: false,
    run: async (args: any[], Bot: Bot) => {
        const content: BotEvents = args[0];
        
        logger.log(`> Bot has encountered an error:\n> ${content}`, "red", true)
        await Bot.endAndRestart();
        return;
    }
}