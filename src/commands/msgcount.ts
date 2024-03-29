import type { ForestBotApiClient } from 'forestbot-api';
import { config } from '../config.js';

export default {
    commands: ['msgcount', 'messages'],
    description: `Use ${config.prefix}msgcount to get the number of messages a user has sent.`,
    minArgs: 0,
    maxArgs: 1,
    execute: async (user, args, bot, api: ForestBotApiClient) => {
        const search = args[0] ? args[0] : user;

        const data = await api.getMessageCount(search);
        if (!data) return

        return bot.bot.chat(`${search}: ${data.messagecount} messages`);
    }
} as MCommand