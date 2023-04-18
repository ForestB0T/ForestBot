import type Bot from '../structure/mineflayer/Bot.js';

export default {
    commands: ['poop', "poo"],
    minArgs: 0,
    maxArgs: 1,
    execute: async (user: string, args: any[], bot: Bot) => {
        return bot.bot.chat(`poop`)
    }
 } as MCommand