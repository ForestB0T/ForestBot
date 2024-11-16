import type { ForestBotAPI } from "forestbot-api-wrapper-v2";
import { config } from '../config.js';
import time from "../functions/utils/time.js";

export default {
    commands: ['quote', 'q'],
    description: `Retrieves a random quote from a user. Usage: ${config.prefix}quote <username>`,
    minArgs: 0,
    maxArgs: 1,
    execute: async (user, args, bot, api: ForestBotAPI) => {
        const search = args[0] ? args[0] : user;
    
        const data = await api.getQuote(search, config.mc_server);
     
        console.log(data, " quote dats")

        if (!data || !data.message) { 
            if (search === user) {
                bot.Whisper(user, `I have no quotes recorded for you, or unexpected error occurred.`);
            } else {
                bot.Whisper(user, `I have no quotes recorded for ${search}, or unexpected error occurred.`);
            }
            return;
        }

        let date: string | undefined = undefined;

        // there is an error here we need to figure out
        
        if (!data.date) {
            date = ""
        }else {
            date = data.date
        }
    
        //check if date is a digit. 
        if (date && date.match(/^\d+$/)) { 
            //convert our timestamp to a human readable format
            date = time.timeAgoStr(parseInt(date));
        } else {
            date = ""
        }

        return bot.bot.chat(`${search}: ${data.message} ${date ? `(${date})` : ''}`);
    }
} as MCommand