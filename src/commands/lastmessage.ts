import type Bot from '../structure/mineflayer/Bot.js';
import time     from '../functions/utils/time.js';

export default {
    commands: ['lastmessage', 'lm'],
    minArgs: 0,
    maxArgs: 1,
    execute: async (user: string, args: any[], bot: Bot) => {
        const search = args[0] ? args[0] : user;

        const data = await bot.endpoints.getLastMessage(search, bot.mc_server)
        if (!data) return

        const lastMessage = data.messages[0];
        const lastMsgStr = `"${lastMessage.message}" ${lastMessage.date !== null &&  `(${time.timeAgoStr(parseInt(lastMessage.date))})`}`

        return !args[0]
        ? bot.bot.whisper(user, `${lastMsgStr}`)
        : bot.bot.chat(`${lastMessage.name}: ${lastMsgStr}`)
    }
} as MCommand