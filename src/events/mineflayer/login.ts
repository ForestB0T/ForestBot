import type Bot   from "../../structure/mineflayer/Bot.js"
import logger     from "../../functions/utils/logger.js";

export default { 
    name: "login",
    once: true,
    run: (Bot: Bot) => {
        logger.log(`> Connected to ${Bot.options.host} successfully`, "green", true);
        
        setInterval(() => {
            Object.keys(Bot.bot.players).forEach(player => Bot.endpoints.savePlaytime(player, Bot.mc_server))
        }, 60000)

    }
}