import type Bot from '../structure/mineflayer/Bot.js';
import time     from '../functions/utils/time.js';

export default {
    commands: ['lastdeath', 'ld'],
    minArgs: 0,
    maxArgs: 1,
    execute: async (user: string, args: any[], bot: Bot) => {
        const search = args[0] ? args[0] : user;

        const data = await bot.endpoints.getLastDeath(search, bot.mc_server)
        if (!data) return bot.bot.whisper(user, "User not found.")

        return !args[0]
            ? bot.bot.whisper(user, `${data.death}, ${time.timeAgoStr(data.time)}`)
            : bot.bot.chat(`${data.death}, ${time.timeAgoStr(data.time)}`)

    }
} as MCommand