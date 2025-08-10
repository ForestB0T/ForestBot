import type Bot from "../../structure/mineflayer/Bot.js"
import { Logger, api } from "../../index.js";
import { config } from "../../config.js";

export default {
    name: "login",
    on: true,
    run: async (args: [], Bot: Bot) => {
        Logger.login(`Connected to ${Bot.options.host} successfully`);

        if (config.useCustomChatPrefix) {
            const originalChat = Bot.bot.chat
            Bot.bot.chat = (message: string) => originalChat(`${config.customChatPrefix} ${message}`);
        }
    }
}