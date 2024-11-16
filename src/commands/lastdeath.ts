import time from '../functions/utils/time.js';
import type { ForestBotAPI } from 'forestbot-api-wrapper-v2';
import { config } from '../config.js';
import type Bot from '../structure/mineflayer/Bot.js';

export default {
    commands: ['lastdeath', 'ld'],
    description: `Retrieves the last death of a user. Usage: ${config.prefix}lastdeath <username>`,
    minArgs: 0,
    maxArgs: 1,
    execute: async (user, args, bot: Bot, api: ForestBotAPI) => {
        const search = args[0] ? args[0] : user;


        //TODO! we just need to get the lastdeath time and the last death string from the get all user stats helper.
        // REMEMBER al of our main player stats now come from just one single endpoint. not a bunch of different ones.

        const uuid = await api.convertUsernameToUuid(search)
        const data = await api.getDeaths(uuid, config.mc_server, 1, 'DESC', "all");

        if (!data || data.length === 0 || !data[0].death_message) {
            if (search === user) {
                bot.Whisper(user, `You have no deaths, or unexpected error occurred.`);
            } else {
                bot.Whisper(user, `${search} has no deaths, or unexpected error occurred.`);
            }
            return;
        }

        const death = data[0].death_message;
        const timeAgoStr = time.timeAgoStr((parseInt(data[0].time.toString())));

        bot.bot.chat(`${death}, ${timeAgoStr}`);
    }
} as MCommand