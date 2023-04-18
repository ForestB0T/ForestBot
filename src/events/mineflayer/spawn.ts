import type Bot from "../../structure/mineflayer/Bot.js"
import { config } from "../../config.js";
import antiafk from "../../structure/mineflayer/utils/antiAFK.js";
import { Logger, api } from "../../index.js";

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

        return
    }
}