import type Bot from '../structure/mineflayer/Bot.js';
import { config } from '../config.js';
import forestBotAPI from 'forestbot-api-wrapper-v2/build/wrapper.js';

export default {
    commands: ['ping'],
    description: `Check your ping or another user's. Usage: ${config.prefix}ping <username>`,
    minArgs: 0,
    maxArgs: 1,
    execute: async (user, args, bot, api: forestBotAPI) => {
        const search = args[0] ? args[0] : user;
        try {
            let str = ``
            const ping = bot.bot.players[search].ping;
            str = `${search}: ${ping}ms`;
            if (ping == 0) str = `${search}: ${ping}ms (Most likely just joined.)`;


            bot.bot.chat(str);
        
            return
        }
        catch { return }
    }
 } as MCommand