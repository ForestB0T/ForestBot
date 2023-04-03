import type Bot      from "../../structure/mineflayer/Bot.js"
import { logger}     from "../../index.js";
import { BotEvents } from "mineflayer";

export default {
    name: 'kicked',
    once: false,
    run: async (content: BotEvents, Bot: Bot) => {
        logger.log(`> Bot has been kicked. Reason: ${content.toString()}`, "yellow", true)
        Bot.bot.end();
        return;
    }
};