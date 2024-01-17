import type { ForestBotApiClient } from "forestbot-api";
import { config } from '../config.js';

export default {
    commands: ['iam'],
    description: `Use ${config.prefix}iam to set your ${config.prefix}whois description.`,
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

            bot.bot.chat(`${user}, your !whois has been set.`);
            return
        } catch {
            return;
        }

    }
} as MCommand