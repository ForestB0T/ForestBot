import type { ForestBotAPI } from "forestbot-api-wrapper-v2"; 
import { config } from '../config.js';

export default {
    commands: ['msgcount', 'messages'],
    description: `Retrives the number of messages a user has sent. Usage: ${config.prefix}msgcount <username>`,
    minArgs: 0,
    maxArgs: 1,
    execute: async (user, args, bot, api: ForestBotAPI) => {
        const search = args[0] ? args[0] : user;

        const data = await api.getMessageCount(search, config.mc_server);
        if (!data || data.count == undefined) {
            if (search === user) {
                bot.Whisper(user, `I have not seen any messages from you, or unexpected error occurred.`);
            } else {
                bot.Whisper(user, `I have not seen any messages from ${search}, or unexpected error occurred.`);
            }
            return
        }

        return bot.bot.chat(`${search}: ${data.count} messages`);
    }
} as MCommand