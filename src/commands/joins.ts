import type { ForestBotApiClient } from "forestbot-api";
import { config } from '../config.js';

export default {
    commands: ['joins'],
    description: `Use ${config.prefix}joins to get the number of times a user has joined the server.`,
    minArgs: 0,
    maxArgs: 1,
    execute: async (user, args, bot, api: ForestBotApiClient) => {
        const search = args[0] ? args[0] : user;

        const data = await api.getJoins(search);
        if (!data) return

        return bot.bot.chat(`${search}: ${data.joins} times`)
    }
} as MCommand