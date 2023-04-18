import type Bot      from '../../structure/mineflayer/Bot.js';
import { BotEvents } from 'mineflayer';
import { Logger }    from "../../index.js";

export default {
    name: "error",
    once: false,
    run: async (args: any[], Bot: Bot) => {
        const content: BotEvents = args[0];
        Logger.error(`${content}`);
        Bot.bot.end();
        return;
    }
}