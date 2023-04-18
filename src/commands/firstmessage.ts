import { ForestBotApiClient } from 'forestbot-api';
import time     from '../functions/utils/time.js';

export default {
    commands: ['firstmessage', 'fm'],
    minArgs: 0,
    maxArgs: 1,
    execute: async (user, args, bot, api: ForestBotApiClient) => {
        const search = args[0] ? args[0] : user;

        const data = await api.getFirstMessage(search);

        if (!data||!data.success) return

        const firstMessage = data.data.messages[0];

        let date: string;
        if (firstMessage.date) {
            date = time.timeAgoStr(typeof firstMessage.date === "string" ? parseInt(firstMessage.date) : firstMessage.date);
        } else {
            date = "";
        }

        const firstMsgStr = `"${firstMessage.message}" (${date})`

        return !args[0]
        ? bot.bot.whisper(user, `${firstMsgStr}`)
        : bot.bot.chat(`${firstMessage.name}: ${firstMsgStr}`)
    }
} as MCommand