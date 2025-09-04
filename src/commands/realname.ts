import type Bot from '../structure/mineflayer/Bot.js';
import { config } from '../config.js';
import forestBotAPI from 'forestbot-api-wrapper-v2/build/wrapper.js';

export default {
    commands: ['realname'],
    description: `Use ${config.prefix}realname to see through a user's nickname.`,
    minArgs: 1,
    maxArgs: 1,
    execute: async (user, args, bot: Bot, api: forestBotAPI) => {
        const usernameToCheck = args[0];
        if (!usernameToCheck) return bot.Whisper(user, `Please provide a username to check.`);

        let found = false;

        for (const player of Object.values(bot.bot.players)) {
            const realUsername = player.username;
            const displayName = player.displayName?.toString() ?? realUsername;

            // Check if input matches the displayName or part of it
            if (displayName === usernameToCheck || displayName.split(" ").includes(usernameToCheck)) {
                if (displayName !== realUsername) {
                    bot.bot.chat(`${usernameToCheck} is a nickname for ${realUsername}`);
                } else {
                    bot.bot.chat(`${usernameToCheck} is the real username.`);
                }
                found = true;
                break;
            }
        }

        if (!found) {
            bot.bot.chat(`No player found matching "${usernameToCheck}" online.`);
        }
    }
} as MCommand;
