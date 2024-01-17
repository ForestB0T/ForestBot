import type Bot from "../../structure/mineflayer/Bot.js"
import { config } from "../../config.js";
import antiafk from "../../structure/mineflayer/utils/antiAFK.js";
import { Logger, api } from "../../index.js";

function getRandomInterval() {
    // Generate a random number between 7 and 25 (in milliseconds)
    return Math.floor(Math.random() * (25 * 60 * 1000 - 7 * 60 * 1000 + 1)) + 7 * 60 * 1000;
}

let currentIndex = 0;

export default {
    name: "spawn",
    once: true,
    run: async (args: any[], Bot: Bot) => {
        Logger.spawn(`${Bot.bot.username} has spawned`);

        await api.postUpdatePlayerList({
            users: Bot.getPlayers(),
            mc_server: Bot.mc_server
        });

        Bot.restartCount = 0;
        Bot.isConnected = true;

        if (config.antiafk) {
            antiafk(Bot.bot);
        }

        const commandDescriptions = Array.from(Bot.commands.values()).map(cmd => cmd.description);

        setInterval(async () => {
            // Get the current command description
            const currentCommand = commandDescriptions[currentIndex];

            // Output the current command description
            Bot.bot.chat(currentCommand);

            // Increment the index for the next iteration
            currentIndex = (currentIndex + 1) % commandDescriptions.length;


        }, getRandomInterval());

        setInterval(async () => { 
            Bot.bot.chat(`My Prefix for commands has changed to " ${config.prefix} "`)
        }, 5 * 60 * 1000);

        return
    }
}