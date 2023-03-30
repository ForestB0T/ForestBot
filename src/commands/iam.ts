import type Bot from '../structure/mineflayer/Bot.js';

export default {
    commands: ['iam'],
    minArgs: 0,
    maxArgs: 255,
    execute: async (user: string, args: any[], bot: Bot) => {

        if (!args || args.length === 0) return;
        try {
            await bot.endpoints.saveIam(user, args.join(" "))
            return !args[0]
            ? bot.bot.whisper(user, `!whois set.`)
            : bot.bot.chat(`${user}, your !whois has been set.`)
        
        } catch {
            return;
        }

    }
} as MCommand