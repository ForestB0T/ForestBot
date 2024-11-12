import type { ForestBotAPI } from "forestbot-api-wrapper-v2";
import time from "../functions/utils/time.js";
import { config } from '../config.js';
import Bot from "../structure/mineflayer/Bot.js";

export default {
    commands: ['joindate', 'jd', 'firstseen'],
    description: `Use ${config.prefix}joindate to get the join date of a player.`,
    minArgs: 0,
    maxArgs: 1,
    execute: async (user, args, bot:Bot, api: ForestBotAPI) => {
        const search = args[0] ? args[0] : user;

        const uuid = await api.convertUsernameToUuid(search)
        const data = await api.getJoindate(uuid, config.mc_server);

        if (!data || !data.joindate) { 
            if (search === user) {
                bot.Whisper(user, `You have no join date, or unexpected error occurred.`);
            } else {
                bot.Whisper(user, `${search} has no join date, or unexpected error occurred.`);
            }
            return;
        }

        const joindateStr = time.convertUnixTimestamp(parseInt(data.joindate.toString()) / 1000);
        bot.bot.chat(`I first saw ${search}, ${joindateStr}`);
    }
} as MCommand