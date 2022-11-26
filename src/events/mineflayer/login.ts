import type Bot   from "../../structure/mineflayer/Bot.js"
import { logger } from "../../index.js";

export default { 
    name: "login",
    once: true,
    run: (args:[], Bot: Bot) => {
        logger.log(`> Connected to ${Bot.options.host} successfully`, "green", true);
        
        setInterval(async () => {
            Object.keys(Bot.bot.players).forEach(async player => await Bot.endpoints.savePlaytime(player, Bot.mc_server))
        }, 60000)

    }
}