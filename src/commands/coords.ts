import type Bot from '../structure/mineflayer/Bot.js';
import { config } from '../config.js';
import forestBotAPI from 'forestbot-api-wrapper-v2/build/wrapper.js';

export default {
    commands: ['coords'],
    description: `Use ${config.prefix}coords to get the coordinates of the bot.`,
    minArgs: 0,
    maxArgs: 1,
    execute: async (user, args, bot, api: forestBotAPI) => {
        if (bot.useWhitelist && !bot.userWhitelist.has(user)) return;
        return bot.Whisper(user, ` I am currently at: X: ${Math.trunc(bot.bot.entity.position.x)} Y: ${Math.trunc(bot.bot.entity.position.y)} Z: ${Math.trunc(bot.bot.entity.position.z)}`)
    }
 } as MCommand