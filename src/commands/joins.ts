import type { ForestBotApiClient } from "forestbot-api";

export default {
    commands: ['joins'],
    minArgs: 0,
    maxArgs: 1,
    execute: async (user, args, bot, api: ForestBotApiClient) => {
        const search = args[0] ? args[0] : user;

        const data = await api.getJoins(search);
        if (!data) return

        return !args[0]
            ? bot.bot.whisper(user, `${data.joins} times`)
            : bot.bot.chat(`${search}: ${data.joins} times`)
    }
} as MCommand