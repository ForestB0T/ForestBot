import time     from "../functions/utils/time.js";
import type { ForestBotApiClient } from 'forestbot-api';

export default {
    commands: ['playtime', 'pt'],
    description: "Use !playtime to get the playtime of a player.",
    minArgs: 0,
    maxArgs: 1,
    execute: async (user, args, bot, api: ForestBotApiClient) => {
        const search = args[0] ? args[0] : user;

        const data = await api.getPlaytime(search);
        if (!data) return

        const playtime = time.dhms(data.playtime);

        return bot.bot.chat(`${search}: ${playtime}`)

    }
} as MCommand