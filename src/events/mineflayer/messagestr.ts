import { bot, client } from "../../index.js";
import type Bot from "../../structure/mineflayer/Bot.js";
/**
 * This event is basically only used to capture kill messages.
 */
const dividers = ["[w]", "»", "From", "To", ">", ":", "left", "joined", "whispers", "[EUPVP]"];

export default {
    name: "messagestr",
    once: false,
    run: async (args: any[], Bot: Bot) => {
        const message = args[0] as string;
        const words = message.split(" "); 
        
        try {

            if (message.includes("has requested to teleport to you.")) {
                return;
            }

            if (message.includes("has teleported to you") ||
                (message.includes("sent a teleport request to you") && !Bot.userWhitelist.has(words[0]))
            ) {
                return;
            }

            const teleportMatch = message.match(/([^ ]*) sent a teleport request to you/);
            if (teleportMatch) {
                if (Bot.useWhitelist && !Bot.userWhitelist.has(teleportMatch[1])) {
                    return;
                }
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
                const userToSave = Bot.bot.players[words[1]] ? words[1] : words[0];
                Bot.endpoints.saveAdvancement(userToSave, message, Bot.mc_server);
                return;
            }

            if (dividers.some((divider) => message.includes(divider))) return;

            const saveKill = async (victim: string) => {
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

                return;
            }

            if (Bot.bot.players[words[1]] && words[1] === Bot.bot.players[words[1]].username) {
                saveKill(words[1])
                return;
            } 
            else if ((Bot.bot.players[words[0]] && words[0] === Bot.bot.players[words[0]].username) && !Bot.bot.players[words[1]]) {
                saveKill(words[0])
                return;
            }
            return;

        } catch (err) { return console.log(err) }
    }
}