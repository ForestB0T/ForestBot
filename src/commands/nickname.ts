import type Bot from '../structure/mineflayer/Bot.js';
import { config } from '../config.js';

export default {
    commands: ['nickname'],
    description: ` Set the bots nickname in the server. Usage: ${config.prefix}nickname <nickname>`,
    minArgs: 0,
    maxArgs: 1,
    whitelisted: true,
    execute: async (user, args, bot: Bot, api) => {

        bot.bot.chat(` /nick ${args[0]}`);

        return;
    }
} as MCommand