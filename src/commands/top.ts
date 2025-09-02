import forestBotAPI from 'forestbot-api-wrapper-v2/build/wrapper.js';
import { config } from '../config.js';
import Bot from '../structure/mineflayer/Bot.js';

export default {
    commands: ['top'],
    description: `🤖 Shows the top 5 players in a certain statistic. Usage: ${config.prefix}top <kills/deaths/joins/playtime>`,
    minArgs: 0,
    maxArgs: 2,
    execute: async (user, args, bot: Bot, api: forestBotAPI) => {
        if (!args[0]) return 
        
        const choice: string = args[0].toLowerCase();

        try {
            switch (choice) {
                case 'kills':
                    const Kills: string[] | number[] = (await api.getTopStatistic("kills", bot.mc_server, 5)).top_stat;
                    const stringKills: string = Kills.map((element: any) => `${element.username}: ${element.kills}`).join(", ");
                    bot.bot.chat(`🤖 [TOP KILLS]: ${stringKills}`);
                    break;
                case 'deaths':
                    const Deaths: string[] | number[] = (await api.getTopStatistic("deaths", bot.mc_server, 5)).top_stat;
                    const stringDeaths: string = Deaths.map((element: any) => `${element.username}: ${element.deaths}`).join(", ");
                    bot.bot.chat(`🤖 [TOP DEATHS]: ${stringDeaths}`);
                    break;
                case 'joins':
                    const Joins: string[] | number[] = (await api.getTopStatistic("joins", bot.mc_server, 5)).top_stat;
                    const stringJoins: string = Joins.map((element: any) => `${element.username}: ${element.joins}`).join(", ");
                    bot.bot.chat(`🤖 [TOP JOINS/LEAVES]: ${stringJoins}`);
                    break;
                case 'playtime':
                    const Playtime: string[] | number[] = (await api.getTopStatistic("playtime", bot.mc_server, 5)).top_stat;
                    const stringPlaytime: string = Playtime.map((element: any) => `${element.username}: ${Math.floor(element.playtime / (1000 * 60 * 60 * 24))} Days`).join(", ");
                    bot.bot.chat(`🤖 [TOP PLAYTIME]: ${stringPlaytime}`);
                    break;
                default:
                    return;
            }
        } catch (err) {
            return bot.Whisper(user, "Api error");
        }


    }
} as MCommand