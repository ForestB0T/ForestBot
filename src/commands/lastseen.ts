import type Bot from '../structure/mineflayer/Bot.js';
import time     from '../functions/utils/time.js';

export default {
    commands: ['lastseen', 'seen', 'ls'],
    minArgs: 0,
    maxArgs: 1,
    execute: async (user: string, args: any[], bot: Bot) => {
        const search = args[0] ? args[0] : user;

        const data = await bot.endpoints.getLastSeen(search, bot.mc_server)
        if (!data) return

        const userIsOnline = bot.bot.players[search] ? true : false;

        if (userIsOnline && (data && data.lastseen.match(/^\d+$/))) {
            const unixTime = parseInt(data.lastseen);
            const lastseen = time.timeAgoStr(unixTime);
            return bot.bot.chat(`${search} is online and joined ${lastseen}`);
        }

        let lastseenString: string;

        if (data && data.lastseen.match(/^\d+$/)) {
            const timeAgo = time.timeAgoStr(parseInt(data.lastseen));
            lastseenString = `${time.convertUnixTimestamp(parseInt(data.lastseen) / 1000)} (${timeAgo})`;
        } else {
            lastseenString = data.lastseen;
        }

        return !args[0]
        ? bot.bot.whisper(user, `${lastseenString}`)
        : bot.bot.chat(`${search}: ${lastseenString}`);
    }
} as MCommand