import time from '../functions/utils/time.js';
import type { ForestBotAPI } from 'forestbot-api-wrapper-v2';
import { config } from '../config.js';
import Bot from '../structure/mineflayer/Bot.js';

export default {
    commands: ['lastadvancement', 'la', 'advancement'],
    description: `Use ${config.prefix}lastadvancement to get the last advancement of a player.`,
    minArgs: 0,
    maxArgs: 1,
    execute: async (user, args, bot: Bot, api: ForestBotAPI) => {
        const search = args[0] ? args[0] : user;

        console.log(search, user)

        const uuid = await api.convertUsernameToUuid(search);
        const data = await api.getAdvancements(uuid, config.mc_server, 1, 'DESC');

        console.log(data);
        if (!data || data.length === 0) {
            if (search === user) {
                bot.bot.whisper(user, `You have no advancements, or unexpected error occurred.`);
            } else {
                bot.bot.whisper(user, `${search} has no advancements, or unexpected error occurred.`);
            }
            return;
        };

        const timeStampAgo = time.timeAgoStr(parseInt(data[0].time.toString()));
        const advancement = data[0].advancement;

        bot.bot.chat(`${advancement}, ${timeStampAgo}`);
        return;
    }
} as MCommand