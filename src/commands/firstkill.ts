import time from '../functions/utils/time.js';
import type { ForestBotAPI } from 'forestbot-api-wrapper-v2';
import { config } from '../config.js';
import type Bot from '../structure/mineflayer/Bot.js';

export default {
    commands: ['firstkill', 'fk'],
    description: `Retrieves the first kill a user got. Usage: ${config.prefix}firstkill <username>`,
    minArgs: 0,
    maxArgs: 1,
    execute: async (user, args, bot: Bot, api: ForestBotAPI) => {
        const search = args[0] ? args[0] : user;

        const uuid = await api.convertUsernameToUuid(search)
        let data = await api.getKills(uuid, config.mc_server, 1, 'ASC');

        if (!data || data.length === 0 || !data[0].death_message) {
            if (search === user) {
                bot.Whisper(user, `You have no kills, or unexpected error occurred.`);
            } else {
                bot.Whisper(user, `${search} has no kills, or unexpected error occurred.`);
            }
            return;
        }

        const death = data[0].death_message;
        const timeAgoStr = time.timeAgoStr((parseInt(data[0].time.toString())));

        bot.bot.chat(`${death}, ${timeAgoStr}`);
    }
} as MCommand