import type Bot from '../structure/mineflayer/Bot.js';

export default {
    commands: ["owner", "master"],
    minArgs: 0,
    maxArgs: 1,
    execute: async (user: string, args: any[], bot: Bot) => {
        return bot.bot.chat("I am a player ran Bot and owned by Febzey#1854");
    }
 } as MCommand