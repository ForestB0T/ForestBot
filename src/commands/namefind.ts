import type { ForestBotApiClient } from 'forestbot-api';

export default {
    commands: ['search', 'lookup', 'find'],
    description: "Use !search to find a user's username history.",
    minArgs: 0,
    maxArgs: 1,
    execute: async (user, args, bot, api: ForestBotApiClient) => {
        const search = args[0] ? args[0] : user;

        if (!args[0]) return;
        const data = await api.getNameFind(args[0]);
        if (!data || (data.usernames && data.usernames.length <= 0)) return bot.bot.chat(`No matches.`)

        const usernames = data.usernames;

        return bot.bot.chat(`You could be looking for: ${usernames.join(", ")}`)
    }
} as MCommand