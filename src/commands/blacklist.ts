import type Bot from '../structure/mineflayer/Bot.js';
import { config } from '../config.js';
import forestBotAPI from 'forestbot-api-wrapper-v2/build/wrapper.js';

export default {
    commands: ['blacklist'],
    description: ` Use ${config.prefix}blackist add|remove to add, remove, or list users from the blacklist.`,
    minArgs: 0,
    maxArgs: 2,
    whitelisted: true,
    execute: async (user, args: string[], bot: Bot, api: forestBotAPI) => {

        const action = args[0];
        if (action !== "add" && action !== "remove" && action !== "list") {
            return bot.Whisper(user, ` Invalid action. Use ${config.prefix}blacklist add|remove`);
        }

        switch (action) {
            case "add":
            if (args.length < 2) {
                return bot.Whisper(user, ` Please specify a user to add to the blacklist.`);
            }
            const userToAdd = args[1];
            const uuid = bot.bot.players[userToAdd]?.uuid;
            bot.updateLists(uuid, "add", "blacklist");
            bot.Whisper(user, ` Added ${userToAdd} to the blacklist.`);

            bot.loadConfigs();
            break;

            case "remove":
            if (args.length < 2) {
                return bot.Whisper(user, ` Please specify a user to remove from the blacklist.`);
            }
            const userToRemove = args[1];
            const uuidToRemove = bot.bot.players[userToRemove]?.uuid;
            bot.updateLists(uuidToRemove, "remove", "blacklist");
            bot.Whisper(user, ` Removed ${userToRemove} from the blacklist.`);

            bot.loadConfigs();
            break;
        }

    }
 } as MCommand