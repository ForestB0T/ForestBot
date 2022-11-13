import { client } from "../../index.js";
import type Bot from "../../structure/mineflayer/Bot.js";

/**
 * This event is basically only used to capture kill messages.
 */
export default {
    name: "messagestr",
    once: false,
    run: async (args: any[], Bot: Bot) => {
        const message = args[0];
        const c = args[1];

        const firstWord = message.split(" ")[0];
        if (Bot.bot.players[firstWord] && c == "system") {

            let murderer: string = null;
            let victim: string = firstWord;

            const words = message.split(" ");
            words.shift();

            for (const word of words) {
                if (Bot.bot.players[word] && word !== firstWord) {
                    murderer = Bot.bot.players[word].username;
                    break;
                }
            }

            await client.chatEmbed(`> ${message}`, "purple");

            murderer
                ? Bot.endpoints.savePvpKill(victim, murderer, message, Bot.mc_server)
                : Bot.endpoints.savePveKill(victim, message, Bot.mc_server)

        }

    }
}