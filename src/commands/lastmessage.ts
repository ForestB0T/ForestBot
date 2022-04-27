import type Bot from '../structure/mineflayer/Bot.js';
import time     from '../functions/utils/time.js';

export default {
    commands: ['lastmessage', 'lm'],
    minArgs: 0,
    maxArgs: 1,
    execute: async (user: string, args: any[], bot: Bot) => {
        const search = args[0] ? args[0] : user;

        const data = await bot.endpoints.getLastMessage(search, bot.mc_server)
        if (!data) return  bot.bot.whisper(user, "User not found.")

        const date = time.timeAgoStr(parseInt(data.date));
    
        return !args[0]
        ? bot.bot.whisper(user, `${data.message}, ${date}`)
        : bot.bot.chat(`${search}: ${data.message}, ${date}`)
    }
 } as MCommand