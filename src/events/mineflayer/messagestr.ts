import { Logger, api } from "../../index.js";
import type Bot from "../../structure/mineflayer/Bot.js";
import mcCommandHandler from "../../structure/mineflayer/utils/commandHandler.js";
import parseUsername from "../../structure/mineflayer/utils/parseUsername.js";

const log = Logger;
/**
 * This event is basically only used to capture kill messages.
 */
const blacklistedWords = ["[w]", "[Administrator]", "arrived", "kicked", "muted", "banned", "tempbanned", "temp-banned", "[+]", "From", "left", "Left", "joined", "banned", "tempbanned", "whispers", "[EUPVP]", "[Duels]", "voted", "has requested to teleport to you.", "[Rcon]"];

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

        // console.log(args[0], " args msg")

        const stringed = JSON.stringify(chatArgs[2]);
        const parsed = JSON.parse(stringed);

        /**
         * tryna get chat to work for nova-anarchy
         */


        // Check if parsed.with exists and has at least two elements
        if (parsed?.with && parsed.with.length > 1 && parsed.with[1]?.json) {
            console.log(Object.values(parsed.with[1].json), " got osmethn")
            msgg = Object.values(parsed.with[1].json)[0] as string
        }

        //console.log(parsed.json, " pares.json.with")


        if (parsed && parsed.with && parsed.with.length >= 1) {
            const extras = parsed.with[0].extra as any[];
            const extrasFixed = Array.isArray(extras) ? [...extras] : [];
            const lastItem = extrasFixed.length > 0 ? extrasFixed[extrasFixed.length - 1] : null;

            if (lastItem && lastItem.json && typeof lastItem.json === 'object') {
                const dynamicMsg = Object.values(lastItem.json)[0] as string;
                msgg = dynamicMsg ?? msgg;
            }
        }


        try {
            const saveMessage = async (username?: string, uuid?: string, msgg?: string) => {
                if (Bot.userBlacklist.has(uuid)) return;

                log.chat(username, msgg, uuid);

                await api.websocket.sendMinecraftChatMessage({
                    name: username,
                    message: msgg,
                    date: Date.now().toString(),
                    mc_server: Bot.mc_server,
                    uuid: uuid,
                })

                if (username === Bot.bot.username) return;
                await mcCommandHandler(username, msgg, Bot, uuid);
                return;
            }

            if (parsed && parsed.with && parsed.with.length >= 1) {
                const extras = parsed.with[0].extra as any[];
                let username = '';
                let message = '';

                if (extras && extras.length >= 1) {
                    for (const item of extras) {
                        if (item.text && item.text.startsWith('] ')) {
                            username = item.text.substring(2);
                        }
    
                        if (item.json && '' in item.json && item.json[''].startsWith('> ')) {
                            message = item.json[''].substring(2);
                        }
                    }
    
                    if (username && message) {
                        saveMessage(username, Bot.bot.players[username]?.uuid, message);
                        return;
                    }
                }

            }

            /**
             * 
             * Handling player inbound chat.
             * 
             */
            for (const player of Object.values(Bot.bot.players)) {

                /**
                 * Handling rare case where the msg is like this "UsernameMessage"
                 * we will take the "UsernameMessage" string it for a online user.
                 */

                if (msg.startsWith(player.username)) {
                    let _msgg: string = msgg;
                    const usernameLength = player.username.length;
                    const msgLength = msg.length;

                    if (usernameLength < msgLength) {
                        const nextChar = msg[usernameLength];
                        if (nextChar && nextChar !== ' ') {
                            _msgg = msg.slice(usernameLength).trim();
                            uuid = player.uuid;
                            username = player.username;
                            saveMessage(username, uuid, _msgg);
                            return;
                        }
                    }
                }


                if (thereMightBeAUUIDhere === player.uuid) {
                    let message = chatArgs[0];
                    uuid = player.uuid;
                    username = player.username;

                    console.log(uuid, " got uuid")
                    console.log(username, " got username")

                    if (message.startsWith(`<${username}>`)) message = message.replace(`<${username}>`, "").trim();
                    console.log("-----------------")
                    console.log(message, "msgg")
                    console.log(username, "username")
                    console.log("-----------------")
                    saveMessage(username, uuid, message);
                    return;
                }
            }


            if (chat_dividers.some(divider => msg.includes(divider))) {

                let _msgg: string = msgg;

                if (username && _msgg && uuid) return;
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
                            _msgg = _msgg ?? msg.slice(dividerIndex + 1).trim();
                            break;
                        } else {
                            uuid = "no uuid present.";
                            username = possibleUsername;
                            _msgg = _msgg ?? msg.slice(dividerIndex + 1).trim();
                        }
                    };

                    saveMessage(username, uuid, _msgg);
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
            //   if (blacklistedWords.some((w) => message.includes(w))) return;
            if (message.split(/\s+/).some(word => blacklistedWords.includes(word))) return;


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