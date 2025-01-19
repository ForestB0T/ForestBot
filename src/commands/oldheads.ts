import type { ForestBotAPI } from "forestbot-api-wrapper-v2";
import { config } from '../config.js';
import time from "../functions/utils/time.js";
import type Bot from "../structure/mineflayer/Bot.js";

export default {
    commands: ['oldest', 'oldheads', 'oldusers', 'oldestusers', 'oldfags'],
    description: `Retrieves the 3 oldest users. Usage: ${config.prefix}oldest`,
    minArgs: 0,
    maxArgs: 1,
    execute: async (user, args, bot: Bot, api: ForestBotAPI) => {
        const users = await api.getUsersSortedByJoindate(bot.mc_server, 3, 'ASC');

        const replyMsg = `The 3 oldest users online are: ${users.map((user, index) => {
            const joinDateStr = user.joindate && !isNaN(Number(user.joindate)) ? time.timeAgoStr(Number(user.joindate)) : 'unknown';
            return `${index + 1}. ${user.username} (${joinDateStr})`;
        }).join(', ')}`;

        bot.bot.chat(replyMsg);
    }
} as MCommand