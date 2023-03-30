import type Bot from '../structure/mineflayer/Bot.js';

export default {
    commands: ['whois'],
    minArgs: 0,
    maxArgs: 255,
    execute: async (user: string, args: any[], bot: Bot) => {
        const search = args[0] ? args[0] : user;

        const data = await bot.endpoints.getWhoIs(search)
        if (!data || data.Error||data.error) return bot.bot.chat(`${search} has not yet set a description with !iam`)


        const description = data.description;


        return !args[0]
        ? bot.bot.whisper(user, `${description}`)
        : bot.bot.chat(`${description}`)
    }
} as MCommand