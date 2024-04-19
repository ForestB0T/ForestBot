import { config } from '../config.js';


export default {
    commands: ['discord'],
    description: `Use ${config.prefix}discord to get the discord link.`,
    minArgs: 0,
    maxArgs: 1,
    execute: async (user, args, bot) => {
        return bot.bot.chat("You can join the ForestBot discord here: https://discord.gg/2P8enrdY6t");
    }
 } as MCommand