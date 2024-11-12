import type Bot from '../structure/mineflayer/Bot.js';
import { config } from '../config.js';
import forestBotAPI from 'forestbot-api-wrapper-v2/build/wrapper.js';

export default {
    commands: ["owner", "master"],
    description: `Use ${config.prefix}owner to get the owner of the bot.`,
    minArgs: 0,
    maxArgs: 1,
    execute: async (user, args, bot, api: forestBotAPI) => {
        return bot.bot.chat("I am a player ran bot and owned by Febzey");
    }
 } as MCommand