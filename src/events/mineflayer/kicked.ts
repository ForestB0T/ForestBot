import type Bot      from "../../structure/mineflayer/Bot.js"
import { Logger}     from "../../index.js";
import { BotEvents } from "mineflayer";

export default {
    name: 'kicked',
    once: false,
    run: async (content: BotEvents, Bot: Bot) => {
        Logger.kick(`${content.toString()}`);
        Bot.bot.end();
        return;
    }
};