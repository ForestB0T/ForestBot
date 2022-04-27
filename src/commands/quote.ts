import type Bot from '../structure/mineflayer/Bot.js';

export default {
    commands: ['quote', 'q'],
    minArgs: 0,
    maxArgs: 1,
    execute: async (user: string, args: any[], bot: Bot) => {
        const search = args[0] ? args[0] : user;
    
        const data = await bot.endpoints.getQuote(search, bot.mc_server)
        if (!data) return  bot.bot.whisper(user, "User not found.")
    
        return bot.bot.chat(`${search}: ${data.message}`);
    }
} as MCommand