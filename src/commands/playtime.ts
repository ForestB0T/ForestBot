import type Bot from '../structure/mineflayer/Bot.js';
import time     from "../functions/utils/time.js";

export default {
    commands: ['playtime', 'pt'],
    minArgs: 0,
    maxArgs: 1,
    execute: async (user: string, args: any[], bot: Bot) => {
        const search = args[0] ? args[0] : user;

        const data = await bot.endpoints.getPlaytime(search, bot.mc_server); 
        if (!data) return

        const playtime = time.dhms(data.playtime);

        return !args[0]
            ? bot.bot.whisper(user, "Your playtime is: " + playtime)
            : bot.bot.chat(`${search}: ${playtime}`)

    }
} as MCommand