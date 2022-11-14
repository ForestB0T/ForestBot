import { client } from "../../index.js";
import type Bot from "../../structure/mineflayer/Bot.js";
/**
 * This event is basically only used to capture kill messages.
 */

const dividers = ["[w]", "»", "From", "To", ">", ":", "left", "joined", "whispers"];

export default {
    name: "messagestr",
    once: false,
    run: async (args: any[], Bot: Bot) => {
        const message = args[0];
        const words = message.split(" ");
        try {
            if (
                message.includes("has made the advancement") ||
                message.includes("has completed the challenge")
            ) {
                client.chatEmbed(`> ${message}`, "yellow");
                return;
            }

            if (
                ((args[2] && args[2]["json"].translate) && args[2]["json"].translate.includes("death")) ||
                (words[0] === Bot.bot.players[words[0]].username && !dividers.some((divider) => message.includes(divider)))
            ) {

                const victim = words[0];
                let murderer = null;

                for (const word of words) {
                    if (Bot.bot.players[word] && word !== victim) {
                        murderer = word;
                        break;
                    }
                }

                await client.chatEmbed(`> ${message}`, "purple").catch(() => { });

                murderer
                    ? Bot.endpoints.savePvpKill(victim, murderer, message, Bot.mc_server)
                    : Bot.endpoints.savePveKill(victim, message, Bot.mc_server)

            }

            return;
        } catch { }
    }
}