import time     from "../functions/utils/time.js";
import { config } from '../config.js';
import { ForestBotAPI } from "forestbot-api-wrapper-v2";
import Bot from "../structure/mineflayer/Bot.js";

export default {
    commands: ['playtime', 'pt'],
    description: `Retrieves the total playtime of a user. Usage: ${config.prefix}playtime <username>`,
    minArgs: 0,
    maxArgs: 1,
    execute: async (user, args, bot:Bot, api: ForestBotAPI) => {
        const search = args[0] ? args[0] : user;

        const uuid = await api.convertUsernameToUuid(search)
        const data = await api.getPlaytime(uuid, bot.mc_server);

        if (!data || !data.playtime) { 
            if (search === user) {
                bot.Whisper(user, `I have no playtime recorded for you, or unexpected error occurred.`);
                return
            } else {
                bot.Whisper(user, `I have no playtime recorded for ${search}, or unexpected error occurred.`);
                return
            }
        }

        const playtime = time.dhms(data.playtime);
        return bot.bot.chat(`${search}'s total playtime is ${playtime}`)
    }
} as MCommand