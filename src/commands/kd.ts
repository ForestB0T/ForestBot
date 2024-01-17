import type { ForestBotApiClient } from "forestbot-api";
import { config } from '../config.js';

export default {
    commands: ['kd', 'kills', 'deaths'],
    description: `Use ${config.prefix}kd to get the number of kills and deaths a user has.`,
    minArgs: 0,
    maxArgs: 1,
    execute: async (user, args, bot, api: ForestBotApiClient) => {
        const search = args[0] ? args[0] : user;

        const data = await api.getKd(search);
        if (!data) return

        return bot.bot.chat(`${search}: Kills: ${data.kills} Deaths: ${data.deaths}`)

    }
} as MCommand