import { Logger, api } from "../../index.js";
import type Bot from "../../structure/mineflayer/Bot.js";
import mcCommandHandler from "../../structure/mineflayer/utils/commandHandler.js";
import parseUsername from "../../structure/mineflayer/utils/parseUsername.js";

const log = Logger;

const blacklistedWords = [
  "[w]", "[Administrator]", "arrived", "kicked", "muted", "banned", 
  "tempbanned", "temp-banned", "[+]", "From", "left", "Left", "joined", 
  "whispers", "[EUPVP]", "[Duels]", "voted", "has requested to teleport to you.", "[Rcon]"
];

export default {
  name: "messagestr",
  once: false,
  run: async (args: any[], Bot: Bot) => {
    const rawMessage = args[0] as string;
    const chatArgs = [...args];

    console.log(rawMessage, " rawMessage args[0]");
    // console.log(rawMessage, " rawMessage args[0]")
    // console.log(chatArgs, " chatArgs args")w

    try {
      // Early exit for blacklisted words
      if (rawMessage.split(/\s+/).some(word => blacklistedWords.includes(word))) {
        return;
      }

      // Special handling for chatArgs structure: [username, 'chat', ChatMessage, uuid, ...]
      if (
        typeof chatArgs[0] === "string" &&
        typeof chatArgs[2] === "object" &&
        chatArgs[2]?.with &&
        typeof chatArgs[3] === "string"
      ) {
        let uuid = chatArgs[3];
        let username = chatArgs[0];
        console.log("uuid", uuid, "username", username);
        // If uuid matches a player, use that player's username
        const playerByUuid = Object.values(Bot.bot.players).find(p => p.uuid === uuid);
        if (playerByUuid) {
          username = playerByUuid.username;
        }

        let message = "";

        // Try to extract message from ChatMessage object
        if (Array.isArray(chatArgs[2].with) && chatArgs[2].with.length > 0) {
          const msgObj = chatArgs[2].with[0];
          if (typeof msgObj.text === "string") {
            message = msgObj.text;
          } else if (typeof msgObj.toString === "function") {
            message = msgObj.toString();
          }
        } else if (typeof chatArgs[2].toString === "function") {
          message = chatArgs[2].toString();
        }

        // Fallback: if message is empty, use rawMessage
        if (!message) message = rawMessage;

        // Save the message if valid
        if (username && message && message !== ":" && message !== "") {
          if (!Bot.userBlacklist.has(uuid)) {
            log.chat(username, message, uuid);
            await api.websocket.sendMinecraftChatMessage({
              name: username,
              message,
              date: Date.now().toString(),
              mc_server: Bot.mc_server,
              uuid,
            });
            if (username !== Bot.bot.username) {
              await mcCommandHandler(username, message, Bot, uuid);
            }
          }
        }
        return;
      }

      // Handle advancements
      if (
        rawMessage.includes("has reached the goal") ||
        rawMessage.includes("has made the advancement") ||
        rawMessage.includes("has completed the challenge")
      ) {
        const words = rawMessage.split(" ");
        const userToSave = Bot.bot.players[words[1]] ? words[1] : words[0];
        const uuid = Bot.bot.players[userToSave]?.uuid ?? "no uuid present";

        await api.websocket.sendPlayerAdvancement({
          username: userToSave,
          advancement: rawMessage,
          time: Date.now(),
          mc_server: Bot.mc_server,
          uuid,
        });

        log.advancement(rawMessage);
        return;
      }

      // Handle deaths and kills
      const handleDeath = async (victim: string) => {
        const words = rawMessage.split(" ");
        const victimIndex = words.indexOf(victim);
        let murderer: string | null = null;

        for (let i = victimIndex + 1; i < words.length; i++) {
          if (Bot.bot.players[words[i]]) {
            if (Bot.bot.players[words[i + 1]]) {
              murderer = words[i + 1];
              break;
            }
            murderer = words[i];
            break;
          }
        }

        log.death(rawMessage);

        await api.websocket.sendPlayerDeath({
          victim,
          death_message: rawMessage,
          murderer,
          time: Date.now(),
          type: "pvp",
          mc_server: Bot.mc_server,
          victimUUID: Bot.bot.players[victim]?.uuid ?? null,
          murdererUUID: murderer ? Bot.bot.players[murderer]?.uuid ?? "" : "",
          id: undefined,
        });
      };

      const players = Object.values(Bot.bot.players);

      // --- PATCH: Skip death handling if message matches chat format (username> message or username > message) ---
      // Check for chat message pattern: username > message or username> message
      let isChatFormat = false;
      for (const player of players) {
        // Check for both "username> message" and "username > message"
        if (
          rawMessage.startsWith(player.username + ">") ||
          rawMessage.startsWith(player.username + " >")
        ) {
          isChatFormat = true;
          break;
        }
      }

      if (!isChatFormat) {
        for (const player of players) {
          if (rawMessage.includes(player.username)) {
            if (Bot.bot.players[rawMessage.split(" ")[0]] && !Bot.bot.players[rawMessage.split(" ")[1]]) {
              await handleDeath(rawMessage.split(" ")[0]);
              return;
            } else if (Bot.bot.players[rawMessage.split(" ")[1]]) {
              await handleDeath(rawMessage.split(" ")[1]);
              return;
            }
          }
        }
      }
      // --- END PATCH ---

      // Handle chat messages
      const saveMessage = async (username: string, uuid: string, message: string) => {
        if (Bot.userBlacklist.has(uuid)) return;

        log.chat(username, message, uuid);

        await api.websocket.sendMinecraftChatMessage({
          name: username,
          message,
          date: Date.now().toString(),
          mc_server: Bot.mc_server,
          uuid,
        });

        if (username !== Bot.bot.username) {
          await mcCommandHandler(username, message, Bot, uuid);
        }
      };

      // Parse chat message
      const parsed = JSON.parse(JSON.stringify(chatArgs[2] ?? {}));
      let username = "";
      let message = rawMessage;
      let uuid = "no uuid present";

      // Try parsing JSON-based chat (modern Minecraft versions)
      if (parsed?.with && parsed.with.length > 0) {
        const extras = parsed.with[0]?.extra ?? [];
        for (const item of extras) {
          if (item.text && !username) {
            const possibleUsername = parseUsername(item.text.trim(), Bot.bot);
            if (Bot.bot.players[possibleUsername]) {
              username = possibleUsername;
              uuid = Bot.bot.players[username].uuid;
            }
          }
          if (item.json && typeof item.json === "object") {
            const jsonValues = Object.values(item.json);
            if (jsonValues.length > 0 && typeof jsonValues[0] === "string") {
              message = jsonValues[0].replace(/^[:>»]\s*/, "").trim();
            }
          }
        }
      }

      // Fallback for simpler chat formats (e.g., <username> message)
      if (!username) {
        const chatDividers = ["»", ">>", ">", ":"];
        for (const divider of chatDividers) {
          // PATCH: Allow for optional space after divider (e.g., "username > message" or "username> message")
          const regex = new RegExp(`^(.+?)\\s*\\${divider}\\s*(.+)$`);
          const match = rawMessage.match(regex);
          if (match) {
            const senderRaw = match[1];
            const msgContent = match[2];
            const possibleUsername = parseUsername(senderRaw.trim(), Bot.bot);
            if (Bot.bot.players[possibleUsername]) {
              username = possibleUsername;
              uuid = Bot.bot.players[username].uuid;
              message = msgContent.trim();
              break;
            }
          }
        }
      }

      // Handle concatenated username-message format (e.g., "UsernameMessage")
      if (!username) {
        for (const player of players) {
          if (rawMessage.startsWith(player.username)) {
            const usernameLength = player.username.length;
            if (rawMessage.length > usernameLength && rawMessage[usernameLength] !== " ") {
              username = player.username;
              uuid = player.uuid;
              message = rawMessage.slice(usernameLength).trim();
              break;
            }
          }
        }
      }

      // Final validation and saving
      if (username && message && message !== ":" && message !== "") {
        await saveMessage(username, uuid, message);
      }

    } catch (err) {
      if (!err.toString().includes("reading 'uuid'")) {
        console.error("Error processing message:", err);
      }
    }
  },
};