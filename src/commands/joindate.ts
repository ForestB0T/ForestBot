import { ForestBotApiClient } from "forestbot-api";
import time from "../functions/utils/time.js";
import { config } from '../config.js';

export default {
    commands: ['joindate', 'jd', 'firstseen'],
    description: `Use ${config.prefix}joindate to get the join date of a player.`,
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
        bot.bot.chat(`I first saw ${search}, ${joindateStr}`);
        return;
    }
} as MCommand