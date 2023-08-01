import time from '../functions/utils/time.js';
import { ForestBotApiClient } from 'forestbot-api';

export default {
    commands: ['lastmessage', 'lm'],
    minArgs: 0,
    maxArgs: 1,
    execute: async (user, args, bot, api: ForestBotApiClient) => {
        const search = args[0] ? args[0] : user;

        const data = await api.getLastMessage(search);
        if (!data || !data.success) return

        const lastMessage = data.data.messages[0];
        const lastMsgStr = `"${lastMessage.message}" ${lastMessage.date !== null ? `(${time.timeAgoStr(parseInt(lastMessage.date.toString()))})` : ""}`

        return bot.bot.chat(`${lastMessage.name}: ${lastMsgStr}`)
    }
} as MCommand