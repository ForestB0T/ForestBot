
import type Bot from '../../structure/mineflayer/Bot.js';
import { api, Logger } from '../../index.js';
import mcCommandHandler from '../../structure/mineflayer/utils/commandHandler.js';
import { config } from '../../config.js';

const ignoreContains = [
    "joined the game",
    "left the game",
    "voted",
    "kicked",
    "banned",
    "muted",
    "tempbanned",
    "temp-banned",
    "has requested to teleport to you.",
    "whisper",
    "[Rcon]"
];

const ignoreStartsWith = [
    "From ",
    "To "
];

export default {
    name: 'message',
    once: false,
    run: async (args: any[], Bot: Bot) => {
        if (config.useLegacyChat) return; // Skip if using legacy chat handling

        const fullMsg = args[0].toString();

        const currentOnlinePlayers = Bot.getPlayers().map(p => p.username);
        const commandsList = Array.from(Bot.commands.values()).flatMap(entry => entry.commands);

        if (
            ignoreContains.some(phrase => fullMsg.includes(phrase)) ||
            ignoreStartsWith.some(phrase => fullMsg.startsWith(phrase))
        ) return;


        for (const player of currentOnlinePlayers) {
            // Only proceed if the message includes the player's name
            if (!fullMsg.includes(player)) continue;
            console.log(fullMsg, " fullMsg by " + player);
            //if (player === Bot.bot.username) continue; // Ignore messages about itself

            const uuid = await api.convertUsernameToUuid(player);


            if (
                fullMsg.includes("has reached the goal") ||
                fullMsg.includes("has made the advancement") ||
                fullMsg.includes("has completed the challenge")
            ) {
                if (!/\[.+\]$/.test(fullMsg)) {
                    return; // ❌ doesn't end with brackets
                }

                // ensure the messages starts with the player's name
                if (!fullMsg.startsWith(player)) {
                    return; // ❌ doesn't start with the player's name
                }

                await api.websocket.sendPlayerAdvancement({
                    username: player,
                    advancement: fullMsg,
                    time: Date.now(),
                    mc_server: Bot.mc_server,
                    uuid,
                });

                Logger.advancement(fullMsg);
                return;
            }

            // Checking if the message is a death message;
            if (fullMsg.startsWith(player)) {
                const words = fullMsg.split(" ");
                const victimIndex = words.indexOf(player);

                const nextWord = words[victimIndex + 1]?.trim();
                if (nextWord === ">" || nextWord?.startsWith(">")) {
                    // definitely chat → skip death detection
                } else if (fullMsg.includes("<") || fullMsg.includes(">")) {
                    // also definitely chat → skip
                }
                else {

                    //check if there is a <> beside the player name



                    let murderer: string | null = null;

                    // Loop over words after victim
                    for (let i = victimIndex + 1; i < words.length; i++) {
                        const possibleMurderer = words[i];
                        if (possibleMurderer !== player && currentOnlinePlayers[possibleMurderer]) {
                            murderer = possibleMurderer;
                            break;
                        }
                    }

                    // Determine type
                    const deathType = murderer ? "pvp" : "pve";
                    const murdereruuid = murderer ? await api.convertUsernameToUuid(murderer) : null;

                    await api.websocket.sendPlayerDeath({
                        victim: player,
                        death_message: fullMsg,
                        murderer,
                        time: Date.now(),
                        type: deathType,
                        mc_server: Bot.mc_server,
                        victimUUID: uuid,
                        murdererUUID: murdereruuid,
                        id: undefined
                    });

                    Logger.death(fullMsg);
                    return;
                }
            }




            for (const command of commandsList) {
                // Check if the message contains the command with the prefix
                const commandWithPrefix = `${config.prefix}${command}`;

                // Find positions
                const playerIndex = fullMsg.indexOf(player);
                const commandIndex = fullMsg.indexOf(commandWithPrefix);

                // Make sure both exist and player comes first
                if (playerIndex !== -1 && commandIndex !== -1 && playerIndex < commandIndex) {
                    // Extract everything after the command
                    const afterCommandText = fullMsg.slice(commandIndex + commandWithPrefix.length).trim();

                    const commandMessage = `${commandWithPrefix} ${afterCommandText}`.trim();
                    mcCommandHandler(player, commandMessage, Bot, uuid);

                    return; // Exit after handling first detected command
                }
            }


            // Replace it only if it's at the start
            Logger.chat(player, fullMsg, uuid || null);

            // fix it so we get rid of the <> and the players usrname in the fullmsg
            // before saving to api

            function cleanPlayerFromMsg(fullMsg: string, player: string): string {
                // Regex matches <player>, < player>, player>, <player >, etc.
                const pattern = new RegExp(`\\s*<?\\s*${player}\\s*>?\\s*`);
                return fullMsg.replace(pattern, ` ${player} `).trim();
            }

            const cleanedMessage = cleanPlayerFromMsg(fullMsg, player);

            await api.websocket.sendMinecraftChatMessage({
                name: player,
                message: cleanedMessage,
                date: Date.now().toString(),
                mc_server: Bot.mc_server,
                uuid,
            });

            return;
        }
    }
};