import type Bot   from "../../structure/mineflayer/Bot.js"
import { logger } from "../../index.js";

export default { 
    name: "login",
    once: true,
    run: (args:[], Bot: Bot) => {
        logger.log(`> Connected to ${Bot.options.host} successfully`, "green", true);

        setInterval(async () => {
            await Bot.endpoints.savePlaytime(
                Object.keys(Bot.bot.players),
                Bot.mc_server
            );


            let playerList = Bot.getPlayers()
            await Bot.endpoints.updateplayerlist(playerList, Bot.mc_server);

        }, 60000);
    }
}