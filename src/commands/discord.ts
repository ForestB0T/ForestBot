import { config } from '../config.js';


export default {
    commands: ['discord'],
    description: `Shares the Discord server invite link. Usage: ${config.prefix}discord`,
    minArgs: 0,
    maxArgs: 1,
    execute: async (user, args, bot) => {
        return bot.bot.chat(" You can join the ForestBot discord here: https://discord.gg/2P8enrdY6t");
    }
 } as MCommand