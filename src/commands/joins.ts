import type Bot from "../structure/mineflayer/Bot";

export default {
    commands: ['joins'],
    minArgs: 0,
    maxArgs: 1,
    execute: async (user: string, args: any[], bot: Bot) => {
        const search = args[0] ? args[0] : user;

        const data = await bot.endpoints.getJoins(search, bot.mc_server)
        if (!data) return

        return !args[0]
            ? bot.bot.whisper(user, `${data.joins} times`)
            : bot.bot.chat(`${search}: ${data.joins} times`)
    }
} as MCommand