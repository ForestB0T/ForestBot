import type { ForestBotAPI } from "forestbot-api-wrapper-v2"; 
import { config } from '../config.js';

export default {
    commands: ['advancements', 'totaladvancements'],
    description: `Use ${config.prefix}advancements to get the number of advancements a user has.`,
    minArgs: 0,
    maxArgs: 1,
    execute: async (user, args, bot, api: ForestBotAPI) => {
        const search = args[0] ? args[0] : user;

        const uuid = await api.convertUsernameToUuid(search)
        const data = await api.getTotalAdvancementsCount(uuid, config.mc_server);
 
        if (!data || data == undefined) {
            if (search === user) {
                bot.Whisper(user, `I have not seen any advancements from you, or unexpected error occurred.`);
            } else {
                bot.Whisper(user, `I have not seen any advancements from ${search}, or unexpected error occurred.`);
            }
            return
        }

        return bot.bot.chat(`I have seen ${data} advancements from ${search}`);
        

    }
} as MCommand