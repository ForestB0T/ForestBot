import type { ForestBotApiClient } from 'forestbot-api';
import { config } from '../config.js';

export default {
    commands: ['quote', 'q'],
    description: `Use ${config.prefix}quote to get a random quote from a user.`,
    minArgs: 0,
    maxArgs: 1,
    execute: async (user, args, bot, api: ForestBotApiClient) => {
        const search = args[0] ? args[0] : user;
    
        const data = await api.getQuote(search);
        if (!data) return
    
        return bot.bot.chat(`${search}: ${data.message}`);
    }
} as MCommand