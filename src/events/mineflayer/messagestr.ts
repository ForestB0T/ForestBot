import { bot, client } from "../../index.js";
import type Bot from "../../structure/mineflayer/Bot.js";
/**
 * This event is basically only used to capture kill messages.
 */

const dividers = ["[w]", "»", "From", "To", ">", ":", "left", "joined", "whispers"];

export default {
    name: "messagestr",
    once: false,
    run: async (args: any[], Bot: Bot) => {
        const message = args[0] as string;
        const words = message.split(" ");
        try {

            if (message.includes("has teleported to you") ||
                (message.includes("sent a teleport request to you") && !bot.userWhitelist.has(words[0]))
            ) {
                return;
            }

            const teleportMatch = message.match(/([^ ]*) sent a teleport request to you/);
            if (teleportMatch) {
                if (bot.useWhitelist === true && !bot.userWhitelist.has(teleportMatch[1])) return
                const sender = teleportMatch[1];
                bot.bot.chat(`/tpaccept ${sender}`)
                return;
            }

            if (
                message.includes("has reached the goal") ||
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
        } catch { return; }
    }
}