import type Bot   from "../../structure/mineflayer/Bot.js"
import { logger } from "../../index.js";

let intrvl: NodeJS.Timer;

export default { 
    name: "login",
    once: true,
    run: async  (args:[], Bot: Bot) => {
        logger.log(`> Connected to ${Bot.options.host} successfully`, "green", true);

        if (intrvl) {
            clearInterval(intrvl);
        };

        intrvl = setInterval(async () => {
            await Bot.endpoints.savePlaytime(
                Object.keys(Bot.bot.players),
                Bot.mc_server
            );

            await Bot.endpoints.updateplayerlist(Bot.getPlayers(), Bot.mc_server);

        }, 60000);

    }
}