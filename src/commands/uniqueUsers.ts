import type { ForestBotAPI } from "forestbot-api-wrapper-v2";
import { config } from '../config.js';
import time from "../functions/utils/time.js";
import type Bot from "../structure/mineflayer/Bot.js";

export default {
    commands: ['users', 'uniqueusers'],
    description: `🤖 See the unique user count: ${config.prefix}users`,
    minArgs: 0,
    maxArgs: 1,
    execute: async (user, args, bot: Bot, api: ForestBotAPI) => {
        const server = bot.mc_server;
        const uniqueUsers = await api.getUniqueUsers(server);

        const uniqueUsersCount = uniqueUsers.length;
        const string = `🤖 I have seen ${uniqueUsersCount} different users on this server! api.forestbot.org/unique-users?server=${server}`;
        bot.bot.chat(string);
    }
} as MCommand