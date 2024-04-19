import { config } from '../config.js';

export default {
    commands: ['help', 'commands', 'invite'],
    description: `Use ${config.prefix}help to get the help message.`,
    minArgs: 0,
    maxArgs: 2,
    execute: async (user, args, bot) => {
        return bot.bot.chat("https://forestbot.org");
    }
 } as MCommand