import { config } from "../../config.js";
import { bot, Logger, api } from "../../index.js";
import type Bot from "../../structure/mineflayer/Bot.js";
import mcCommandHandler from "../../structure/mineflayer/utils/commandHandler.js";
import parseUsername from "../../structure/mineflayer/utils/parseUsername.js";

const log = Logger;
/**
 * This event is basically only used to capture kill messages.
 */
const blacklistedWords = ["[w]", "[Administrator]", "[+]", "From", "To", "left", "Left", "joined", "whispers", "[EUPVP]", "[Duels]", "voted", "has requested to teleport to you.", "[Rcon]"];

export default {
    name: "messagestr",
    once: false,
    run: async (args: any[], Bot: Bot) => {
        const message = args[0] as string;
        const words = message.split(" ");
        const chatArgs = [...args];
        const chat_dividers = ["»", ">>", ">", ":"];
        const thereMightBeAUUIDhere = chatArgs[3];

        let username: string;
        let msgg: string;
        let uuid: string;
        let msg = chatArgs[0];

        try {


            const saveMessage = async () => {
                if (username && msgg && uuid) {

                    log.chat(username, msgg, uuid);

                    await api.websocket.sendMinecraftChatMessage({
                        name: username,
                        message: msgg,
                        date: Date.now().toString(),
                        mc_server: Bot.mc_server,
                        uuid: uuid,
                    })


                    if (username === Bot.bot.username) return;

                    await mcCommandHandler(username, msgg, Bot);
                    return;
                }
            }

            /**
             * 
             * Handling player inbound chat.
             * 
             */
            for (const player of Object.values(Bot.bot.players)) {
                if (thereMightBeAUUIDhere === player.uuid) {
                    msgg = chatArgs[0];
                    uuid = player.uuid;
                    username = player.username;

                    if (msgg.startsWith(`<${username}>`)) msgg = msgg.replace(`<${username}>`, "").trim();

                    saveMessage();
                    return;
                }
            }


            if (chat_dividers.some(divider => msg.includes(divider))) {
                if (username && msgg && uuid) return;

                console.log(
                    username, "username",
                    msgg, " message",

                )

                for (const char of msg) {
                    if (!chat_dividers.includes(char)) continue;
                    const dividerIndex = msg.indexOf(char);

                    if (msg[dividerIndex + 1] === ">") {
                        msg = msg.replace(">", "");
                    }


                    if (!dividerIndex) continue;
                    if (dividerIndex >= 30) continue;

                    const senderRaw = msg.slice(0, dividerIndex).trim();
                    const senderRawSplit = senderRaw.split(" ");

                    for (let i = senderRawSplit.length - 1; i >= 0; i--) {
                        const possibleUsername = parseUsername(senderRawSplit[i], Bot.bot);

                        if (Bot.bot.players[possibleUsername]) {
                            uuid = Bot.bot.players[possibleUsername].uuid
                            username = Bot.bot.players[possibleUsername].username
                            msgg = msg.slice(dividerIndex + 1).trim();
                            break;
                        } else {
                            uuid = "no uuid present.";
                            username = possibleUsername;
                            msgg = msg.slice(dividerIndex + 1).trim();
                        }
                    };

                    saveMessage();
                    return
                }

            }


            /**
             * 
             * Handling inbound player advancements.
             * 
             */
            if (
                message.includes("has reached the goal") ||
                message.includes("has made the advancement") ||
                message.includes("has completed the challenge")
            ) {
                const userToSave = Bot.bot.players[words[1]] ? words[1] : words[0];
                const uuid = Bot.bot.players[userToSave].uuid;

                await api.websocket.sendPlayerAdvancement({
                    username: userToSave,
                    advancement: message,
                    time: Date.now(),
                    mc_server: Bot.mc_server,
                    uuid: uuid,
                })


                log.advancement(message);
                return;
            }


            /**
             * Returning if any blacklisted words are found.
             */
            if (blacklistedWords.some((w) => message.includes(w))) return;


            /**
             * 
             * Handling player inbound deaths and kills.
             * @param victim 
             * 
             */
            const saveKill = async (victim: string) => {
                const victimIndex = words.indexOf(victim);

                //Checking for a murderer
                let murderer = null;
                for (let i = victimIndex + 1; i < words.length; i++) {
                    if (Bot.bot.players[words[i]]) {
                        if (Bot.bot.players[words[i + 1]]) {
                            murderer = words[i + 1]
                            break;
                        }
                        murderer = words[i];
                        break;
                    }
                }

                log.death(message);

                if (murderer) {

                    await api.websocket.sendPlayerDeath({
                        victim: victim,
                        death_message: message,
                        murderer: murderer,
                        time: Date.now(),
                        type: "pvp",
                        mc_server: Bot.mc_server,
                        victimUUID: Bot.bot.players[victim].uuid ?? null,
                        murdererUUID: Bot.bot.players[murderer].uuid ?? "",
                        id: undefined
                    })

                } else {

                    await api.websocket.sendPlayerDeath({
                        victim: victim,
                        death_message: message,
                        time: Date.now(),
                        type: "pvp",
                        mc_server: Bot.mc_server,
                        victimUUID: Bot.bot.players[victim].uuid ?? null,
                        id: undefined
                    })
                }


            }


            const players = Object.values(Bot.bot.players);

            for (const player of players) {
                if (words[0] === player.username) {
                    
                    if (Bot.bot.players[words[0]] && !Bot.bot.players[words[1]]) {
                        saveKill(words[0]);

                    } else if (Bot.bot.players[words[1]]) {
                        saveKill(words[1]);
                    }
                    
                    return;
                }
            }

            return;



        } catch (err) {
            /**
             * Handling and cathing any errors.
             */

            if (err.toString().includes("reading 'uuid'")) return;
            console.log(err)
        }
    }
}