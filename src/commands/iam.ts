import type { ForestBotApiClient } from "forestbot-api";

export default {
    commands: ['iam'],
    minArgs: 0,
    maxArgs: 255,
    execute: async (user, args, bot, api: ForestBotApiClient) => {
        if (!args || args.length === 0) return bot.bot.chat("View descriptions with !whois or set one with !iam");
        try {
            //  await bot.endpoints.saveIam(user, args.join(" "))

            await api.postSaveIamDescription({
                user: user,
                description: args.join(" ")
            });

            return !args[0]
                ? bot.bot.whisper(user, `!whois set.`)
                : bot.bot.chat(`${user}, your !whois has been set.`)

        } catch {
            return;
        }

    }
} as MCommand