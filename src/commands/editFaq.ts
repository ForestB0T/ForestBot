import type { ForestBotAPI } from "forestbot-api-wrapper-v2";
import { config } from '../config.js';
import Bot from "../structure/mineflayer/Bot.js";

export default {
    commands: ['editfaq'],
    description: `Edits an existing FAQ entry. Usage: ${config.prefix}editfaq <id> <new text>`,
    minArgs: 2,
    maxArgs: 255,
    execute: async (user, args, bot: Bot, api: ForestBotAPI) => {

        const id = args[0];
        const newFaqText = args.slice(1).join(" ");

        if (!id || isNaN(Number(id))) {
            bot.bot.whisper(user, "Please provide a valid FAQ ID. Usage: !editfaq <id> <new text>");
            return;
        }

        if (newFaqText.startsWith("/")) {
            bot.bot.whisper(user, "FAQ text cannot start with '/'.");
            return;
        }

        if (newFaqText.length < 5) {
            bot.bot.whisper(user, "FAQ text must be at least 5 characters long.");
            return;
        }

        try {
            const uuid = await api.convertUsernameToUuid(user);

            const data = await api.editFaq(
                id, user, newFaqText, uuid, bot.mc_server
            );

            if (!data) {
                bot.bot.whisper(user, "An error occurred while editing your FAQ.");
                return;
            }

            if (data.error) {
                bot.bot.whisper(user, data.error);
                return;
            }

            bot.bot.whisper(user, `Your FAQ has been successfully updated. ID: ${id}.`);

        } catch (err) {
            console.error(err);
            bot.bot.whisper(user, "An unexpected error occurred while editing your FAQ.");
        }
    }

} as MCommand;
