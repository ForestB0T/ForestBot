import type { ForestBotAPI } from "forestbot-api-wrapper-v2";
import { config } from '../config.js';
import time from "../functions/utils/time.js";

export default {
    commands: ['rq', 'randomquote'],
    description: `Retrieves a random quote. Usage: ${config.prefix}rq <phrase>(optional)`,
    minArgs: 0,
    maxArgs: 1,
    execute: async (user, args, bot, api: ForestBotAPI) => {
        const options = args[0] ? { random: true, phrase: args[0] } : { random: true };

        const data = await api.getQuote("none", config.mc_server, options);

        console.log(data, " quote data")

        if (!data || !data.message) {
            bot.Whisper(user, `unexpected error occurred.`);

            return;
        }

        let date: string | undefined = undefined;

        // there is an error here we need to figure out

        if (!data.date) {
            date = ""
        } else {
            date = data.date
        }

        //check if date is a digit. 
        if (date && date.match(/^\d+$/)) {
            //convert our timestamp to a human readable format
            date = time.timeAgoStr(parseInt(date));
        } else {
            date = ""
        }

        return bot.bot.chat(`Quote from ${data.name}: "${data.message}" ${date ? `(${date})` : ''}`);
    }
} as MCommand