import type { ForestBotApiClient } from 'forestbot-api';

export default {
    commands: ['wordcount', 'words', 'count'],
    minArgs: 0,
    maxArgs: 1,
    execute: async (user, args, bot, api: ForestBotApiClient) => {
        const search = args[0]        
        const word = args[1];

        if (!search||!word) return;
        const data = await api.getWordOccurenceCount(search, word);
        
        if (!data || !data.word_count) return

        return !args[0]
            ? bot.bot.whisper(user, `"${word}" occurences: ${data.word_count}`)
            : bot.bot.chat(`${search}: "${word}" occurences: ${data.word_count}`)

    }
} as MCommand