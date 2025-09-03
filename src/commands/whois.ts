import type { ForestBotAPI } from "forestbot-api-wrapper-v2";
import { config } from '../config.js';
import Bot from "../structure/mineflayer/Bot.js";

export default {
    commands: ['whois'],
    description: ` Shows the description of a user. Usage: ${config.prefix}whois <username>`,
    minArgs: 0,
    maxArgs: 255,
    execute: async (user, args, bot: Bot, api: ForestBotAPI) => {
        const search = args[0] ? args[0] : user;

        const data = await api.getWhoIs(search);

        if (!data) {
            if (search === user) return bot.Whisper(user, ` You have not yet set a description with !iam`)
            else {
                return bot.Whisper(user, ` ${search} has not yet set a description with !iam`)
            }
            
        }

        bot.bot.chat(` ${search} is ${data.description}`)

        return;
    }
} as MCommand