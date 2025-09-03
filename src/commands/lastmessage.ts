import time from '../functions/utils/time.js';
import type { ForestBotAPI } from 'forestbot-api-wrapper-v2';
import { config } from '../config.js';
import Bot from '../structure/mineflayer/Bot.js';

export default {
    commands: ['lastmessage', 'lm'],
    description: ` Retrieves the last message of a user. Usage: ${config.prefix}lastmessage <username>`,
    minArgs: 0,
    maxArgs: 1,
    execute: async (user, args, bot: Bot, api: ForestBotAPI) => {
        const search = args[0] ? args[0] : user;

        const data = await api.getMessages(search, config.mc_server, 1, 'DESC');

        if (!data || data.length === 0) {
            if (search === user) {
                bot.Whisper(user, ` You have no messages, or unexpected error occurred.`);
            } else {
                bot.Whisper(user, ` ${search} has no messages, or unexpected error occurred.`);
            }
            return;
        }

        const lastMessage = data[0].message;

        let date = "";

        // need to check if the date.String is able to be converted to a number
        // use a regex to check if it is only numbers
        // if it is, convert it to a number
        // if not, leave it as a string
        if (data[0].date.match(/^[0-9]+$/)) {
            date = time.timeAgoStr(parseInt(data[0].date));
        } else {
            date = data[0].date;
        }

        date = time.timeAgoStr(parseInt(data[0].date.toString()));

        bot.bot.chat(` ${search}: ${lastMessage}, ${date}`);
    }
} as MCommand