import time from '../functions/utils/time.js';
import type { ForestBotApiClient } from 'forestbot-api';
import { config } from '../config.js';

export default {
    commands: ['lastdeath', 'ld'],
    description: `Use ${config.prefix}lastdeath to get the last death of a player.`,
    minArgs: 0,
    maxArgs: 1,
    execute: async (user, args, bot, api: ForestBotApiClient) => {
        const search = args[0] ? args[0] : user;

        const data = await api.getLastdeath(search);

        if (!data) return

        return bot.bot.chat(`${data.death}, ${time.timeAgoStr(parseInt(data.time.toString()))}`)

    }
} as MCommand