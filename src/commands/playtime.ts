import time     from "../functions/utils/time.js";
import { config } from '../config.js';
import { ForestBotAPI } from "forestbot-api-wrapper-v2";
import Bot from "../structure/mineflayer/Bot.js";
import getUuidFromUsername from "../functions/utils/getUuidFromUsername.js";

export default {
    commands: ['playtime', 'pt'],
    description: `Use ${config.prefix}playtime to get the playtime of a player.`,
    minArgs: 0,
    maxArgs: 1,
    execute: async (user, args, bot:Bot, api: ForestBotAPI) => {
        const search = args[0] ? args[0] : user;

        const uuid = await getUuidFromUsername(search, bot);
        const data = await api.getPlaytime(uuid, bot.mc_server);

        if (!data || !data.playtime) { 
            if (search === user) {
                bot.bot.whisper(user, `I have no playtime recorded for you, or unexpected error occurred.`);
                return
            } else {
                bot.bot.whisper(user, `I have no playtime recorded for ${search}, or unexpected error occurred.`);
                return
            }
        }

        const playtime = time.dhms(data.playtime);
        return bot.bot.chat(`${search}'s total playtime is ${playtime}`)
    }
} as MCommand