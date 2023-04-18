import { ForestBotApiClient } from "forestbot-api";
import time from "../functions/utils/time.js";

export default {
    commands: ['joindate', 'jd', 'firstseen'],
    minArgs: 0,
    maxArgs: 1,
    execute: async (user, args, bot, api: ForestBotApiClient) => {
        const search = args[0] ? args[0] : user;

        const data = await api.getJoindate(search);

        if (!data) return

        let joindateStr: string;

        if (data.joindate.toString().match(/^\d+$/)) {
            joindateStr = `${time.convertUnixTimestamp(parseInt(data.joindate.toString()) / 1000)}, (${time.timeAgoStr(parseInt(data.joindate.toString()))})`;
        } else {
            joindateStr = data.joindate as string;
        }

        return !args[0]
            ? bot.bot.whisper(user, `I first saw ${user}, ${joindateStr}`)
            : bot.bot.chat(`I first saw ${search}, ${joindateStr}`);
    }
} as MCommand