import type Client from "../../structure/discord/client";
import { logger, bot } from "../../index.js";

export default {
    name: "ready",
    once: true,
    execute: (_:unknown, client: Client) => {
        logger.log("Discord bot is ready.", "green");
        client.loadChannels(bot.mc_server);
        setInterval(() => { client.loadChannels(bot.mc_server) }, 2 * 60000)
  
    }
}