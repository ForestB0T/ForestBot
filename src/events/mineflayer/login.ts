import type Bot from "../../structure/mineflayer/Bot.js"
import { Logger, api } from "../../index.js";

export default {
    name: "login",
    once: true,
    run: async (args: [], Bot: Bot) => {
        Logger.login(`Connected to ${Bot.options.host} successfully`);
    }
}