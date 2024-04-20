import time from '../functions/utils/time.js';
import type { ForestBotAPI } from 'forestbot-api-wrapper-v2';
import { config } from '../config.js';
import Bot from '../structure/mineflayer/Bot.js';

export default {
    commands: ['lastseen', 'seen', 'ls'],
    description: `Use ${config.prefix}lastseen to get the last time a player was seen.`,
    minArgs: 0,
    maxArgs: 1,
    execute: async (user, args, bot: Bot, api: ForestBotAPI) => {
        const search = args[0] ? args[0] : user;
        const uuid = await api.convertUsernameToUuid(search);
        const data = await api.getLastSeen(uuid, config.mc_server);
        
        if (!data || !data.lastseen) {
            if (search === user) {
                bot.bot.whisper(user, `You haven't been seen by me or unexpected error occurred.`);
            } else {
                bot.bot.whisper(user, `${search} has not been seen by me, or unexpected error occurred.`);
            }
            return;
        }

        const userIsOnline = bot.bot.players[search] ? true : false;

        if (userIsOnline && (data && data.lastseen.toString().match(/^\d+$/))) {
            const unixTime = parseInt(data.lastseen.toString());
            const lastseen = time.timeAgoStr(unixTime);
            return bot.bot.chat(`${search} is playing right now and logged in ${lastseen}`);
        }

        let lastseenString: string;

        if (data && data.lastseen.toString().match(/^\d+$/)) {
            const timeAgo = time.timeAgoStr(parseInt(data.lastseen.toString()));
            lastseenString = `${time.convertUnixTimestamp(parseInt(data.lastseen.toString()) / 1000)} (${timeAgo})`;
        } else {
            lastseenString = data.lastseen.toString();
        }

        return bot.bot.chat(`I last seen ${search} ${lastseenString}`);
    }
} as MCommand