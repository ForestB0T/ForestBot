import type { ForestBotAPI } from "forestbot-api-wrapper-v2";
import { config } from '../config.js';
import Bot from "../structure/mineflayer/Bot.js";

export default {
    commands: ['whois'],
    description: `Use ${config.prefix}whois to get a user's description.`,
    minArgs: 0,
    maxArgs: 255,
    execute: async (user, args, bot: Bot, api: ForestBotAPI) => {
        const search = args[0] ? args[0] : user;

        const data = await api.getWhoIs(search);
        if (!data || !data.descriptions) {
            if (search === user) return bot.bot.whisper(user, `You have not yet set a description with !iam`)
            else {
                return bot.bot.whisper(user, `${search} has not yet set a description with !iam`)
            }
        }

        const descriptions = data.descriptions;

        bot.bot.chat(`${search} is ${descriptions[0]}`)

        return;
    }
} as MCommand