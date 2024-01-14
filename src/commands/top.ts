import type { ForestBotApiClient } from 'forestbot-api';

export default {
    commands: ['top'],
    description: "Use !top to get the top 5 players for a stat.",
    minArgs: 0,
    maxArgs: 2,
    execute: async (user, args, bot, api: ForestBotApiClient) => {
        if (!args[0]) return 
        
        const choice: string = args[0].toLowerCase();

        try {
            switch (choice) {
                case 'kills':
                    const Kills: string[] | number[] = (await api.getTopStat("kills")).top_stat;
                    const stringKills: string = Kills.map((element: any) => `${element.username}: ${element.kills}`).join(", ");
                    bot.bot.chat(`[TOP KILLS]: ${stringKills}`);
                    break;
                case 'deaths':
                    const Deaths: string[] | number[] = (await api.getTopStat("deaths")).top_stat;
                    const stringDeaths: string = Deaths.map((element: any) => `${element.username}: ${element.deaths}`).join(", ");
                    bot.bot.chat(`[TOP DEATHS]: ${stringDeaths}`);
                    break;
                case 'joins':
                    const Joins: string[] | number[] = (await api.getTopStat("joins")).top_stat;
                    const stringJoins: string = Joins.map((element: any) => `${element.username}: ${element.joins}`).join(", ");
                    bot.bot.chat(`[TOP JOINS/LEAVES]: ${stringJoins}`);
                    break;
                case 'playtime':
                    const Playtime: string[] | number[] = (await api.getTopStat("playtime")).top_stat;
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