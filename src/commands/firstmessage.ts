import { ForestBotAPI } from 'forestbot-api-wrapper-v2';
import time from '../functions/utils/time.js';
import { config } from '../config.js';
import Bot from '../structure/mineflayer/Bot.js';

export default {
    commands: ['firstmessage', 'fm'],
    description: `Retrieves the first message of a user. Usage: ${config.prefix}firstmessage <username>`,
    minArgs: 0,
    maxArgs: 1,
    execute: async (user, args, bot: Bot, api: ForestBotAPI) => {
        const search = args[0] ? args[0] : user;

        const data = await api.getMessages(search, config.mc_server, 1, 'ASC');

        if (!data || data.length === 0) {
            if (search === user) {
                bot.Whisper(user, `You have no messages, or unexpected error occurred.`);
                return
            } else {
                bot.Whisper(user, `${search} has no messages, or unexpected error occurred.`);
                return
            }
        }

        const firstMessage = data[0].message;

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

        bot.bot.chat(`${search}: ${firstMessage}, ${date}`);
    }
} as MCommand