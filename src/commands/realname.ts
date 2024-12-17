
/**
 * This is a command used to check a users real name if the user has a nickname
 */
import type Bot from '../structure/mineflayer/Bot.js';
import { config } from '../config.js';
import forestBotAPI from 'forestbot-api-wrapper-v2/build/wrapper.js';

export default {
    commands: ['realname'],
    description: `Use ${config.prefix}realname to see through a users nickname.`,
    minArgs: 1,
    maxArgs: 1,
    execute: async (user, args, bot: Bot, api: forestBotAPI) => {

        if (bot.useWhitelist && !bot.userWhitelist.has(user)) return;

        const username = args[0];
        const player = bot.bot.players[username];

        if (!username) return bot.Whisper(user, `Please provide a username to check the real name of.`);
        if (!player) return bot.Whisper(user, `I could not find the player: ${username}`);


        for (const player of Object.values(bot.bot.players)) {

            const displayName = player.displayName;
            if (!displayName.extra) return;
            if (displayName.extra.length > 0 && 'text' in displayName.extra[0]) {
                if (displayName.extra[0].text === username) {
                    return bot.Whisper(user, `The real name of ${username} is: ${player.username}`);
                } else {
                    return bot.Whisper(user, `I could not find the player: ${username}`);
                }
            }

        }


        return bot.Whisper(user, `The real name of ${username} is: ${player.username}`);

    }
 } as MCommand
