import { ForestBotApiClient } from 'forestbot-api';
import type Bot from '../structure/mineflayer/Bot.js';
import { config } from '../config.js';


export default {
    commands: ['discord'],
    description: `Use ${config.prefix}discord to get the discord link.`,
    minArgs: 0,
    maxArgs: 1,
    execute: async (user, args, bot, api: ForestBotApiClient) => {
        return bot.bot.chat("You can join the ForestBot discord here: https://api.forestbot.org/discord");
    }
 } as MCommand