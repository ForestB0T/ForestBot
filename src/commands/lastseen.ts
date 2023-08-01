import time from '../functions/utils/time.js';
import type { ForestBotApiClient } from 'forestbot-api';

export default {
    commands: ['lastseen', 'seen', 'ls'],
    minArgs: 0,
    maxArgs: 1,
    execute: async (user, args, bot, api: ForestBotApiClient) => {
        const search = args[0] ? args[0] : user;

        const data = await api.getLastSeen(search);
        if (!data) return

        const userIsOnline = bot.bot.players[search] ? true : false;

        if (userIsOnline && (data && data.lastseen.toString().match(/^\d+$/))) {
            const unixTime = parseInt(data.lastseen.toString());
            const lastseen = time.timeAgoStr(unixTime);
            return bot.bot.chat(`${search} is online and logged in ${lastseen}`);
        }

        let lastseenString: string;

        if (data && data.lastseen.toString().match(/^\d+$/)) {
            const timeAgo = time.timeAgoStr(parseInt(data.lastseen.toString()));
            lastseenString = `${time.convertUnixTimestamp(parseInt(data.lastseen.toString()) / 1000)} (${timeAgo})`;
        } else {
            lastseenString = data.lastseen.toString();
        }

        return bot.bot.chat(`${search}: ${lastseenString}`);
    }
} as MCommand