import { config } from '../config.js';


export default {
    commands: ['profile'],
    description: `Shares a link to your ForestBot Profile. Usage: ${config.prefix}profile <user>`,
    minArgs: 0,
    maxArgs: 1,
    execute: async (user, args, bot) => {
        return bot.bot.chat(`https://forestbot.org/u/${args[0]}`);
    }
 } as MCommand