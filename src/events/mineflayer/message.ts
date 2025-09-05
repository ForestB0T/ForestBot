import type Bot from '../../structure/mineflayer/Bot.js';
import { api, Logger } from '../../index.js';
import mcCommandHandler from '../../structure/mineflayer/utils/commandHandler.js';
import { config } from '../../config.js';
import parseUsername from '../../structure/mineflayer/utils/parseUsername.js';

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

function splitRightCarrotInFirstWord(words: string[]): string[] {
    if (words.length === 0) return words;

    let first = words[0];
    if (first.endsWith(">") && first.length > 1) {
        return [first.slice(0, -1), ">", ...words.slice(1)];
    }

    return words;
}

function removePlayerFromMsg(fullMsg: string, player: string): string {
    // Matches <player>, < player>, player>, <player >, or just player
    const pattern = new RegExp(`\\s*<?\\s*${player}\\s*>?\\s*`, "g");
    return fullMsg.replace(pattern, " ").trim().replace(/\s+/g, " ");
}

function extractPlayerMessage(fullMsg: string, currentOnlinePlayers: Map<string, string>): { player: string | null, message: string } {
    const words = fullMsg.split(" ");
    const firstTwoWords = words.slice(0, 2).map(w => w.replace(/^<|>$/g, ""));
    // remove absolutely any < > from first twoTwoWords
    
    console.log("First two words:", firstTwoWords);
    console.log("Current online players:", Array.from(currentOnlinePlayers.keys()));
    for (const word of firstTwoWords) {
        for (const [realName, displayName] of currentOnlinePlayers) {
            if (word === realName || word === displayName) {
                // Found a player in first two words
                const cleanedMessage = removePlayerFromMsg(fullMsg, realName);
                return { player: realName, message: cleanedMessage };
            }
        }
    }

    // No username in first two words → return full message as-is
    return { player: null, message: fullMsg };
}


export default {
    name: 'message',
    once: false,
    run: async (args: any[], Bot: Bot) => {
        if (config.useLegacyChat) return;

        let fullMsg = args[0].toString();
        let words = fullMsg.split(" ");
        words = splitRightCarrotInFirstWord(words);
        fullMsg = words.join(" ");

        // Build realName -> displayName map
        const currentOnlinePlayers = new Map<string, string>();
        for (const [realName, playerObj] of Object.entries(Bot.bot.players)) {
            const displayName = playerObj.displayName?.toString() ?? realName;
            currentOnlinePlayers.set(realName, displayName);
        }
        if (
            ignoreContains.some(phrase => fullMsg.includes(phrase)) ||
            ignoreStartsWith.some(phrase => fullMsg.startsWith(phrase))
        ) return;

        const { player, message } = extractPlayerMessage(fullMsg, currentOnlinePlayers);
        if (!player) return;

    

        // --- Determine the leftmost "sender" ---
        let firstWord = words[0];
        // Remove dangling '>' if present
        if (firstWord.endsWith(">")) firstWord = firstWord.slice(0, -1);


        const uuid = await api.convertUsernameToUuid(player);
        if (Bot.userBlacklist.has(uuid)) return;
        // --- Advancement messages ---
        if (
            fullMsg.includes("has reached the goal") ||
            fullMsg.includes("has made the advancement") ||
            fullMsg.includes("has completed the challenge")
        ) {
            if (!/\[.+\]$/.test(fullMsg)) return;
            if (!fullMsg.startsWith(firstWord)) return;

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

        // --- Death messages ---
        if (fullMsg.startsWith(firstWord)) {
            const victimIndex = words.indexOf(firstWord);
            const nextWord = words[victimIndex + 1]?.trim();

            if (nextWord !== ">" && !nextWord?.startsWith(">") && !fullMsg.includes("<") && !fullMsg.includes(">")) {
                let murderer: string | null = null;

                for (let i = victimIndex + 1; i < words.length; i++) {
                    const possibleMurdererWord = words[i];
                    for (const [realName, displayName] of currentOnlinePlayers) {
                        if (possibleMurdererWord === realName || possibleMurdererWord === displayName) {
                            murderer = realName;
                            break;
                        }
                    }
                    if (murderer) break;
                }

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

        // --- Command handling ---
        const commandsList = Array.from(Bot.commands.values()).flatMap(entry => entry.commands);

        for (const command of commandsList) {
            const commandWithPrefix = `${config.prefix}${command}`;
            const commandIndex = fullMsg.indexOf(commandWithPrefix);

            // Only process if the command exists and player is at the start
            if (commandIndex !== -1 && fullMsg.startsWith(firstWord)) {
                const afterCommandText = fullMsg.slice(commandIndex + commandWithPrefix.length).trim();
                const commandMessage = `${commandWithPrefix} ${afterCommandText}`.trim();
                mcCommandHandler(player, commandMessage, Bot, uuid);
                return;
            }
        }

        // --- Regular chat message ---
        const cleanedMessage = removePlayerFromMsg(fullMsg, player);

        await api.websocket.sendMinecraftChatMessage({
            name: player,
            message: cleanedMessage,
            date: Date.now().toString(),
            mc_server: Bot.mc_server,
            uuid,
        });

        Logger.chat(player, fullMsg, uuid || null);
    }
};
