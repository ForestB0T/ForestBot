import time from '../functions/utils/time.js';
import type { ForestBotApiClient } from 'forestbot-api';

export default {
    commands: ['lastdeath', 'ld'],
    minArgs: 0,
    maxArgs: 1,
    execute: async (user, args, bot, api: ForestBotApiClient) => {
        const search = args[0] ? args[0] : user;

        const data = await api.getLastdeath(search);

        if (!data) return

        return !args[0]
            ? bot.bot.whisper(user, `${data.death}, ${time.timeAgoStr(parseInt(data.time.toString()))}`)
            : bot.bot.chat(`${data.death}, ${time.timeAgoStr(parseInt(data.time.toString()))}`)

    }
} as MCommand