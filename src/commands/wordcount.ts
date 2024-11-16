import type { ForestBotAPI } from "forestbot-api-wrapper-v2";
import { config } from '../config.js';
import Bot from "../structure/mineflayer/Bot.js";

export default {
    commands: ['wordcount', 'words', 'count'],
    description: `Shows the number of times a user has said a word. Usage: ${config.prefix}wordcount <username> <word>`,
    minArgs: 0,
    maxArgs: 1,
    execute: async (user, args, bot: Bot, api: ForestBotAPI) => {
        const search = args[0]        
        const word = args[1];

        if (!search||!word) {
            return bot.Whisper(user, "Please provide a player and a word to search for.")
        }

        const data = await api.getWordOccurence(search, config.mc_server, word);
        if (!data || data.count === undefined) {
            return bot.Whisper(user, `${search} has not said ${word}`)
        }

        bot.bot.chat(`${search} has said ${word} ${data.count} times`)

        return;

    }
} as MCommand