import type Bot        from "../../structure/mineflayer/Bot.js"
import { config }      from "../../config.js";
import antiafk         from "../../structure/mineflayer/utils/antiAFK.js";
import { Logger, api } from "../../index.js";

const getRandomInterval = () => Math.floor(Math.random() * (45 * 60 * 1000 - 15 * 60 * 1000 + 1)) + 15 * 60 * 1000;

let announceInterval: NodeJS.Timeout = null;
let playerListUpdateInterval: NodeJS.Timeout = null;

export default {
    name: "spawn",
    once: true,
    run: async (args: any[], Bot: Bot) => {
        Logger.spawn(`${Bot.bot.username} has spawned`);

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

        if (announceInterval) clearInterval(announceInterval);

        const commandDescriptions = Array.from(Bot.commands.values())
            .filter(cmd => !cmd.whitelisted)
            .map(cmd => cmd.description);

        if (config.announce) {
            const usedIndices = new Set<number>();

            announceInterval = setInterval(async () => {
            if (usedIndices.size === commandDescriptions.length) {
                usedIndices.clear();
            }

            let randomIndex: number;
            do {
                randomIndex = Math.floor(Math.random() * commandDescriptions.length);
            } while (usedIndices.has(randomIndex));

            usedIndices.add(randomIndex);

            const currentCommand = commandDescriptions[randomIndex];
            const command = Array.from(Bot.commands.values()).find(cmd => cmd.description === currentCommand);
            const cmd_name = command.commands[0];

            // DO not announce whitelisted commands
            if (command.whitelisted) return;

            // Do not announce disabled commands
            if (Object.keys(config.commands).some(k => k === cmd_name) && !config.commands[cmd_name]) return;

            Bot.bot.chat(command.description);

            }, getRandomInterval());
        }

        return
    }
}