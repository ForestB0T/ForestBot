import type Bot from '../structure/mineflayer/Bot.js';
import time     from '../functions/utils/time.js';

export default {
    commands: ['firstmessage', 'fm'],
    minArgs: 0,
    maxArgs: 1,
    execute: async (user: string, args: any[], bot: Bot) => {
        const search = args[0] ? args[0] : user;

        const data = await bot.endpoints.getFirstMessage(search, bot.mc_server)
        if (!data) return

        const firstMessage = data.messages[0];
        const firstMsgStr = `"${firstMessage.message}" ${firstMessage.date !== null &&  `(${time.timeAgoStr(parseInt(firstMessage.date))})`}`

        return !args[0]
        ? bot.bot.whisper(user, `${firstMsgStr}`)
        : bot.bot.chat(`${firstMessage.name}: ${firstMsgStr}`)
    }
} as MCommand