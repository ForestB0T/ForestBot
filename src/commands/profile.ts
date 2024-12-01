import { config } from '../config.js';


export default {
    commands: ['profile'],
    description: `Shares a link to your ForestBot Profile. Usage: ${config.prefix}profile <user>`,
    minArgs: 0,
    maxArgs: 1,
    execute: async (user, args, bot) => {

        const userToSearch = args[0] ? args[0] : user;
        return bot.bot.chat(`https://forestbot.org/u/${userToSearch}`);
    }
 } as MCommand