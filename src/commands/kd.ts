import type Bot from "../structure/mineflayer/Bot";

export default {
    commands: ['kd', 'kills', 'deaths'],
    minArgs: 0,
    maxArgs: 1,
    execute: async (user: string, args: any[], bot: Bot) => {
        const search = args[0] ? args[0] : user;

        const data = await bot.endpoints.getKd(search, bot.mc_server)
        if (!data) return bot.bot.whisper(user, "User not found.")

        return !args[0]
            ? bot.bot.whisper(user, `Kills: ${data.kills} Deaths: ${data.deaths}`)
            : bot.bot.chat(`${search}: Kills: ${data.kills} Deaths: ${data.deaths}`)

    }
}