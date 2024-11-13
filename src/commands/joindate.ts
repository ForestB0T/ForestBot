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

        //check if joindate is only digits
        let jd: string = "";
        if (!/^\d+$/.test(data.joindate as string)) {
            jd = time.convertUnixTimestamp(parseInt(data.joindate.toString()) / 1000)
        } else {
            jd = data.joindate as string;
        }
        bot.bot.chat(`I first saw ${search}, ${jd}`);
    }
} as MCommand