import type Bot from "../../structure/mineflayer/Bot.js"
import { config } from "../../config.js";
import antiafk from "../../structure/mineflayer/utils/antiAFK.js";
import { Logger, api } from "../../index.js";

function getRandomInterval() {
    // Generate a random number between 3 minutes and 10 minutes (in milliseconds)
    return Math.floor(Math.random() * (10 * 60 * 1000 - 3 * 60 * 1000 + 1)) + 3 * 60 * 1000;
}

let currentIndex = 0;
let announceInterval: NodeJS.Timeout = null;
let playerListUpdateInterval: NodeJS.Timeout = null;


export default {
    name: "spawn",
    once: true,
    run: async (args: any[], Bot: Bot) => {
        Logger.spawn(`${Bot.bot.username} has spawned`);

        //Updating playerlist for tablist, while also upating playtime every 60000 milliseconds
        await api.websocket.sendPlayerListUpdate(Bot.getPlayers());

        if (playerListUpdateInterval) {
            clearInterval(playerListUpdateInterval)
        };

        playerListUpdateInterval = setInterval(async () => {
            await api.websocket.sendPlayerListUpdate(Bot.getPlayers());
        }, 60000);
        

        Bot.restartCount = 0;
        Bot.isConnected = true;

        if (config.antiafk) {
            antiafk(Bot.bot);
        }

        //When bot restarts. this interval will be cleared.
        if (announceInterval) clearInterval(announceInterval);

        const commandDescriptions = Array.from(Bot.commands.values()).map(cmd => cmd.description);

        if (config.announce) {
            const usedIndices = new Set<number>();

            announceInterval = setInterval(async () => {
            if (usedIndices.size === commandDescriptions.length) {
                usedIndices.clear();
            }

            let randomIndex;
            do {
                randomIndex = Math.floor(Math.random() * commandDescriptions.length);
            } while (usedIndices.has(randomIndex));

            usedIndices.add(randomIndex);

            const currentCommand = commandDescriptions[randomIndex];
            const command = Array.from(Bot.commands.values()).find(cmd => cmd.description === currentCommand);
            const cmd_name = command.commands[0];

            if (Object.keys(config.commands).some(k => k === cmd_name) && !config.commands[cmd_name]) return;

            Bot.bot.chat(command.description);

            }, getRandomInterval());
        }

        return
    }
}