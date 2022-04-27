import type Bot from '../structure/mineflayer/Bot.js';

export default {
    commands: ['ping'],
    minArgs: 0,
    maxArgs: 1,
    execute: async (user: string, args: any[], bot: Bot) => {
        const search = args[0] ? args[0] : user;
        try {
            return bot.bot.chat(`${search}: ${bot.bot.players[search].ping}ms`)
        }
        catch { return }
    }
 } as MCommand