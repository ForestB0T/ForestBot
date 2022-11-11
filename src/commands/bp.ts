import type Bot from '../structure/mineflayer/Bot.js';

export default {
    commands: ['bp', 'bestping'],
    minArgs: 0,
    maxArgs: 1,
    execute: async (user: string, args: any[], bot: Bot) => {
        const h:any[] = Object.entries(bot.bot.players).sort((a:any[],b:any[]) => a[1].ping - b[1].ping);
        const ping = bot.bot.players[h[0][0]].ping;
        let str = ``;
        str = `${h[0][0]}: ${ping}ms`;
        if (ping == 0) str = `${h[0][0]}: ${ping}ms (Most likely just joined.)`;

        return bot.bot.chat(`Best ping: ${str}`);
    }
 } as MCommand