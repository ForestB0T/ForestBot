import type Bot from '../structure/mineflayer/Bot.js';

export default {
    commands: ['discord'],
    minArgs: 0,
    maxArgs: 1,
    execute: async (user: string, args: any[], bot: Bot) => {
        return bot.bot.chat("You can join the ForestBot discord here: https://api.forestbot.org/discord");
    }
 } as MCommand