import time from '../functions/utils/time.js';
import type { ForestBotAPI } from 'forestbot-api-wrapper-v2';
import { config } from '../config.js';
import Bot from '../structure/mineflayer/Bot.js';

export default {
    commands: ['lastmessage', 'lm'],
    description: `Use ${config.prefix}lastmessage to get the last message of a player.`,
    minArgs: 0,
    maxArgs: 1,
    execute: async (user, args, bot: Bot, api: ForestBotAPI) => {
        const search = args[0] ? args[0] : user;

        // const data = await api.getLastMessage(search);
        // if (!data || !data.success) return

        // const lastMessage = data.data.messages[0];
        // const lastMsgStr = `"${lastMessage.message}" ${lastMessage.date !== null ? `(${time.timeAgoStr(parseInt(lastMessage.date.toString()))})` : ""}`

        // return bot.bot.chat(`${lastMessage.name}: ${lastMsgStr}`)
    }
} as MCommand