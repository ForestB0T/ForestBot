import time from '../functions/utils/time.js';
import type { ForestBotAPI } from 'forestbot-api-wrapper-v2';
import { config } from '../config.js';
import type Bot from '../structure/mineflayer/Bot.js';

export default {
    commands: ['lastdeath', 'ld'],
    description: `Use ${config.prefix}lastdeath to get the last death of a player.`,
    minArgs: 0,
    maxArgs: 1,
    execute: async (user, args, bot: Bot, api: ForestBotAPI) => {
        const search = args[0] ? args[0] : user;

        const uuid = await api.convertUsernameToUuid(search);
        const data = await api.getDeaths(uuid, config.mc_server, 1, 'DESC', "all");
        if (!data || data.length === 0) {
            if (search === user) {
                bot.bot.whisper(user, `You have no deaths, or unexpected error occurred.`);
            } else {
                bot.bot.whisper(user, `${search} has no deaths, or unexpected error occurred.`);
            }
            return;
        }

        const death = data[0].death_message;
        const timeAgoStr = time.timeAgoStr((parseInt(data[0].time.toString())));
        
        bot.bot.chat(`${death}, ${timeAgoStr}`);
    }
} as MCommand