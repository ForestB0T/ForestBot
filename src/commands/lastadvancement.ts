import time from '../functions/utils/time.js';
import type { ForestBotApiClient } from 'forestbot-api';

export default {
    commands: ['lastadvancement', 'la', 'advancement'],
    description: "Use !lastadvancement to get the last advancement of a player.",
    minArgs: 0,
    maxArgs: 1,
    execute: async (user, args, bot, api: ForestBotApiClient) => {
        // const search = args[0] ? args[0] : user;

        // const data = await api.

        // if (!data) return

        // return bot.bot.chat(`${data.death}, ${time.timeAgoStr(parseInt(data.time.toString()))}`)
        return bot.bot.chat("This command is not yet implemented.")
    }
} as MCommand