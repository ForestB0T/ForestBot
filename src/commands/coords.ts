import type Bot from '../structure/mineflayer/Bot.js';

export default {
    commands: ['coords'],
    minArgs: 0,
    maxArgs: 1,
    execute: async (user: string, args: any[], bot: Bot) => {
        if (bot.useWhitelist && !bot.userWhitelist.has(user)) return;
        return bot.bot.whisper(user, `I am currently at: X: ${Math.trunc(bot.bot.entity.position.x)} Y: ${Math.trunc(bot.bot.entity.position.y)} Z: ${Math.trunc(bot.bot.entity.position.z)}`)
    }
 } as MCommand