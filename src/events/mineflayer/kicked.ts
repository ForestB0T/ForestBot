import type Bot      from "../../structure/mineflayer/Bot.js"
import { Logger}     from "../../index.js";
import { BotEvents } from "mineflayer";

export default {
    name: 'kicked',
    once: false,
    run: async (content: BotEvents, Bot: Bot) => {
        console.log(Object.values(content));
        Logger.kick(`${content.toString()}`);
        console.log("Kicked content:", content);
        Bot.bot.end();
        return;
    }
};