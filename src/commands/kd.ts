import type { ForestBotApiClient } from "forestbot-api";

export default {
    commands: ['kd', 'kills', 'deaths'],
    minArgs: 0,
    maxArgs: 1,
    execute: async (user, args, bot, api: ForestBotApiClient) => {
        const search = args[0] ? args[0] : user;

        const data = await api.getKd(search);
        if (!data) return

        return bot.bot.chat(`${search}: Kills: ${data.kills} Deaths: ${data.deaths}`)

    }
} as MCommand