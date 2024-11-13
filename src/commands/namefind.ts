import type { ForestBotAPI } from "forestbot-api-wrapper-v2";
import { config } from '../config.js';

export default {
    commands: ['search', 'lookup', 'find'],
    description: `Use ${config.prefix}search to find likely username`,
    minArgs: 0,
    maxArgs: 1,
    execute: async (user, args, bot, api: ForestBotAPI) => {
        if (!args[0]) return;
        const data = await api.getNameFinder(args[0], config.mc_server);

        if (!data || !data.usernames || data.usernames.length == 0) {
            return bot.bot.chat(`No matches found or an unexpected error occured.`);
        }

        const usernames = data.usernames;
        return bot.bot.chat(`You could be looking for: ${usernames.join(", ")}`);
    }
} as MCommand