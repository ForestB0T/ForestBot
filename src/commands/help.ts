import { ForestBotApiClient } from 'forestbot-api';
import type Bot from '../structure/mineflayer/Bot.js';

export default {
    commands: ['help', 'commands', 'invite'],
    description: "Use !help to get the help message.",
    minArgs: 0,
    maxArgs: 2,
    execute: async (user, args, bot, api: ForestBotApiClient) => {
        return bot.bot.chat("https://forestbot.org");
    }
 } as MCommand