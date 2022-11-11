import type Bot from '../structure/mineflayer/Bot.js';

export default {
    commands: ['ping'],
    minArgs: 0,
    maxArgs: 1,
    execute: async (user: string, args: any[], bot: Bot) => {
        const search = args[0] ? args[0] : user;
        try {
            let str = ``
            const ping = bot.bot.players[search].ping;
            str = `${search}: ${ping}ms`;
            if (ping == 0) str = `${search}: ${ping}ms (Most likely just joined.)`;


            return bot.bot.chat(str);
        }
        catch { return }
    }
 } as MCommand