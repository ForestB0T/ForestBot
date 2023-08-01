import type { ForestBotApiClient } from 'forestbot-api';

export default {
    commands: ['whois'],
    minArgs: 0,
    maxArgs: 255,
    execute: async (user, args, bot, api: ForestBotApiClient) => {
        const search = args[0] ? args[0] : user;

        const data = await api.getWhoIs(search);
        if (!data || !data.description) return bot.bot.chat(`${search} has not yet set a description with !iam`)


        const description = data.description;

        return bot.bot.chat(`${description}`)
    }
} as MCommand