import type Bot from '../structure/mineflayer/Bot.js';

export default {
    commands: ['search', 'lookup', 'find'],
    minArgs: 0,
    maxArgs: 255,
    execute: async (user: string, args: any[], bot: Bot) => {
        const search = args[0] ? args[0] : user;

        if (!args[0]) return;
        const data = await bot.endpoints.getNameFind(args[0], bot.mc_server)
        if (!data || data.Error||data.error) return bot.bot.chat(`No matches.`)

        const usernames = data.usernames;

        return !args[0]
        ? bot.bot.whisper(user, `You could be looking for: ${usernames.join(", ")}`)
        : bot.bot.chat(`You could be looking for: ${usernames.join(", ")}`)
    }
} as MCommand