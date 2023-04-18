import type { ForestBotApiClient } from 'forestbot-api';

export default {
    commands: ['quote', 'q'],
    minArgs: 0,
    maxArgs: 1,
    execute: async (user, args, bot, api: ForestBotApiClient) => {
        const search = args[0] ? args[0] : user;
    
        const data = await api.getQuote(search);
        if (!data) return
    
        return bot.bot.chat(`${search}: ${data.message}`);
    }
} as MCommand