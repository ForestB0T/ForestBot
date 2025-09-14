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

/**
 * Remove the player's name (with optional surrounding < > and optional trailing :)
 * from the message and collapse spaces.
 */
function removePlayerFromMsg(fullMsg: string, player: string): string {
    // allow optional spaces, optional < and >, optional trailing colon
    const pattern = new RegExp(`\\s*<?\\s*${player}\\s*>?\\s*:?\\s*`, "g");
    return fullMsg.replace(pattern, " ").trim().replace(/\s+/g, " ");
}

/**
 * Normalize a token for comparison: strip leading/trailing < or > and trailing colon.
 */
function normalizeWord(word: string): string {
    return word.replace(/^<|>$/g, "").replace(/:$/, "");
}

/**
 * Try to extract the player and cleaned message.
 * It checks the first two words (normalized) against current online players.
 */
function extractPlayerMessage(fullMsg: string, currentOnlinePlayers: Map<string, string>): { player: string | null, message: string } {
    const words = fullMsg.split(" ");
    const firstTwoWords = words.slice(0, 2).map(normalizeWord);

    console.log("First two words:", firstTwoWords);

    for (const word of firstTwoWords) {
        for (const [realName, displayName] of currentOnlinePlayers) {
            if (word === realName || word === displayName) {
                const cleanedMessage = removePlayerFromMsg(fullMsg, realName);
                return { player: realName, message: cleanedMessage };
            }
        }
    }

    return { player: null, message: fullMsg };
}

/**
 * Detects generically whether a message is a death/system message
 * (not chat). We avoid hardcoding phrases.
 *
 * Rules:
 *  - If message uses chat formats (player: ... or <player> ... or legacy < > chat) -> NOT death.
 *  - Otherwise, if the line starts with the player's name (after normalization), treat as system line (death/advancement/etc).
 */
function isDeathOrSystemMessage(fullMsg: string, rawFirstWord: string, normalizedFirst: string): boolean {
    // If the raw first word has a trailing colon, it's chat: "name: msg" or "name:" etc.
    if (rawFirstWord.endsWith(":")) return false;

    // If it's explicitly like "<player> ..." or contains legacy angled bracket chat, it's chat
    if (fullMsg.startsWith(`<${normalizedFirst}>`)) return false;
    if (fullMsg.includes("<") && fullMsg.includes(">")) return false;

    // If it starts with normalized name followed by a space (or end), treat as system message.
    // Example that counts: "Player died from ..." OR "Player was slain by Foo"
    // Example that does NOT count: "Player: hello" (caught by rawFirstWord.endsWith(':') earlier)
    const startsWithNormalized = fullMsg.startsWith(normalizedFirst);
    if (!startsWithNormalized) return false;

    // ensure the character after the name is either space or end-of-string (so we don't match e.g. playerExtraName)
    const after = fullMsg.slice(normalizedFirst.length, normalizedFirst.length + 1);
    if (after === "" || after === " ") return true;

    // If after is ":" it's chat (we handled rawFirstWord colon earlier but double-check)
    if (after === ":") return false;

    // Otherwise be conservative: don't classify as death
    return false;
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
            const displayName = (playerObj as any).displayName?.toString() ?? realName;
            currentOnlinePlayers.set(realName, displayName);
        }

        if (
            ignoreContains.some(phrase => fullMsg.includes(phrase)) ||
            ignoreStartsWith.some(phrase => fullMsg.startsWith(phrase))
        ) return;

        // Early return if empty
        if (!fullMsg || fullMsg.trim().length === 0) return;

        // Save raw first word and normalized version for checks
        const rawFirstWord = words[0] ?? "";
        const normalizedFirstWord = normalizeWord(rawFirstWord);

        const { player, message } = extractPlayerMessage(fullMsg, currentOnlinePlayers);
        if (!player) return;

        const uuid = await api.convertUsernameToUuid(player);
        if (Bot.userBlacklist.has(uuid)) return;

        // --- Advancement messages (keep existing behavior) ---
        if (
            fullMsg.includes("has reached the goal") ||
            fullMsg.includes("has made the advancement") ||
            fullMsg.includes("has completed the challenge")
        ) {
            if (!/\[.+\]$/.test(fullMsg)) return;
            if (!fullMsg.startsWith(rawFirstWord) && !fullMsg.startsWith(normalizedFirstWord)) return;

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

        // --- Death / System messages (generic, not hardcoded) ---
        if (isDeathOrSystemMessage(fullMsg, rawFirstWord, normalizedFirstWord)) {
            let murderer: string | null = null;

            // Try to find another online player mentioned (naive scan)
            for (const w of words.slice(1)) {
                const token = normalizeWord(w);
                for (const [realName, displayName] of currentOnlinePlayers) {
                    if (token === realName || token === displayName) {
                        if (realName !== player) {
                            murderer = realName;
                            break;
                        }
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

        // --- Command handling ---
        const commandsList = Array.from(Bot.commands.values()).flatMap(entry => entry.commands);

        // figure out firstWord used for command prefix matching: use normalizedFirstWord
        const firstWordForMatch = normalizedFirstWord;

        for (const command of commandsList) {
            const commandWithPrefix = `${config.prefix}${command}`;
            const commandIndex = fullMsg.indexOf(commandWithPrefix);

            if (commandIndex !== -1 && (fullMsg.startsWith(rawFirstWord) || fullMsg.startsWith(normalizedFirstWord))) {
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
