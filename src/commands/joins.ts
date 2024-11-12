import type { ForestBotAPI } from 'forestbot-api-wrapper-v2';
import type Bot from '../structure/mineflayer/Bot.js';
import { config } from '../config.js';

export default {
    commands: ['joins'],
    description: `Use ${config.prefix}joins to get the number of times a user has joined the server.`,
    minArgs: 0,
    maxArgs: 1,
    execute: async (user, args, bot: Bot, api: ForestBotAPI) => {
        const search = args[0] ? args[0] : user;

        const uuid = await api.convertUsernameToUuid(search)
        const data = await api.getJoinCount(uuid, config.mc_server);

        if (!data || !data.joincount) {
            if (search === user) {
                bot.Whisper(user, `You have no joins, or unexpected error occurred.`);
            } else {
                bot.Whisper(user, `${search} has no joins, or unexpected error occurred.`);
            }
            return;
        }

        return bot.bot.chat(`${search} has joined the server ${data.joincount} times`);
    }
} as MCommand