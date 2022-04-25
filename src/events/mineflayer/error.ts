import type Bot      from '../../structure/mineflayer/Bot.js';
import { BotEvents } from 'mineflayer';
import { logger } from "../../index.js";

export default {
    name: "error",
    once: false,
    run: (content: BotEvents, Bot: Bot) => {
        logger.log(`> Bot has encountered an error:\n> ${content}`, "red", true)
        return;
    }
}