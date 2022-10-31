import type Client from "../../structure/discord/client";
import { logger, bot } from "../../index.js";

export default {
    name: "ready",
    once: true, 
    execute: async (_:unknown, client: Client) => {
        client.loadChannels(bot.mc_server);
        setInterval(async () => { client.loadChannels(bot.mc_server) }, 2 * 60000)
        logger.log("> Discord bot is ready.", "green", false);
    }
}