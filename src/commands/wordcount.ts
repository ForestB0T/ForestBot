import type { ForestBotApiClient } from 'forestbot-api';
import { config } from '../config.js';

export default {
    commands: ['wordcount', 'words', 'count'],
    description: `Use ${config.prefix}wordcount <player> <word> to get the number of times a word has been said in chat.`,
    minArgs: 0,
    maxArgs: 1,
    execute: async (user, args, bot, api: ForestBotApiClient) => {
        const search = args[0]        
        const word = args[1];

        if (!search||!word) return;
        const data = await api.getWordOccurenceCount(search, word);
        
        if (!data || !data.word_count) return

        return bot.bot.chat(`${search}: "${word}" occurences: ${data.word_count}`)

    }
} as MCommand