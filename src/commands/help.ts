import { config } from '../config.js';


export default {
    commands: ['help', 'commands'],
    description: `🤖 See all commands I have to offer.. Usage: ${config.prefix}commands`,
    minArgs: 0,
    maxArgs: 1,
    execute: async (user, args, bot) => {
        return bot.bot.chat("🤖 https://forestbot.org/commands");
    }
 } as MCommand