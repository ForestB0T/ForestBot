import type Bot from "../structure/mineflayer/Bot";
import time     from "../functions/utils/time.js";

export default {
    commands: ['jd', 'joindate'],
    minArgs: 0,
    maxArgs: 1,
    execute: async (user: string, args: any[], bot: Bot) => {
        const search = args[0] ? args[0] : user;

        const data = await bot.endpoints.getJoindate(search, bot.mc_server);
        if (!data) return bot.bot.whisper(user, "User not found.")

        let joindateStr: string;

        if (data.joindate.match(/^\d+$/)) { 
            joindateStr = `${time.convertUnixTimestamp(data.joindate / 1000)}, (${time.timeAgoStr(parseInt(data.joindate))})`;
        } else {
            joindateStr = data.joindate;
        }

        return !args[0]
            ? bot.bot.whisper(user, `${joindateStr}`)
            : bot.bot.chat(`${search}: ${joindateStr}`);
    }
}