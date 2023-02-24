import type Bot from '../structure/mineflayer/Bot.js';

export default {
    commands: ['top'],
    minArgs: 0,
    maxArgs: 2,
    execute: async (user: string, args: any[], bot: Bot) => {
        if (!args[0]) {
            return bot.bot.whisper(user, `Use !top playtime, joins, deaths, kills`)
        }
        const choice: string = args[0].toLowerCase();
        try {
            switch (choice) {
                case 'kills':
                    const Kills: string[]|number[] = (await bot.endpoints.getTopStat('kills', bot.mc_server)).top_stat;
                    const stringKills: string = Kills.map((element: any) => `${element.username}: ${element.kills}`).join(", ");
                    bot.bot.chat(`[TOP KILLS]: ${stringKills}`);
                    break;
                case 'deaths':   
                    const Deaths: string[]|number[] = (await bot.endpoints.getTopStat('deaths', bot.mc_server)).top_stat;
                    const stringDeaths: string = Deaths.map((element: any) => `${element.username}: ${element.deaths}`).join(", ");
                    bot.bot.chat(`[TOP DEATHS]: ${stringDeaths}`);
                    break;
                case 'joins':
                    const Joins: string[]|number[] = (await bot.endpoints.getTopStat('joins', bot.mc_server)).top_stat;
                    const stringJoins: string = Joins.map((element: any) => `${element.username}: ${element.joins}`).join(", ");
                    bot.bot.chat(`[TOP JOINS/LEAVES]: ${stringJoins}`);
                    break;
                case 'playtime':            
                    const Playtime: string[]|number[] = (await bot.endpoints.getTopStat('playtime', bot.mc_server)).top_stat;           
                    const stringPlaytime: string = Playtime.map((element: any) => `${element.username}: ${Math.floor(element.playtime / (1000 * 60 * 60 * 24))} Days`).join(", ");
                    bot.bot.chat(`[TOP PLAYTIME]: ${stringPlaytime}`);
                    break;
                default: 
                    return;
            }
        } catch (err) {
            return bot.bot.whisper(user, "Api error");
        }


    }
 } as MCommand