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

        const words = message.split(" ");
        
        if (Bot.bot.players[words[0]] && c == "system") {            
            if (words[1] === "joined" || words[1] === "left") return;

            let murderer: string = null;
            let victim: string = words[0];

            for (const word of words) {
                if (Bot.bot.players[word] && word !== words[0]) {
                    murderer = Bot.bot.players[word].username;
                    break;
                }
            }

            await client.chatEmbed(`> ${message}`, "purple").catch(() => { });

            murderer
                ? Bot.endpoints.savePvpKill(victim, murderer, message, Bot.mc_server)
                : Bot.endpoints.savePveKill(victim, message, Bot.mc_server)

        }

    }
}