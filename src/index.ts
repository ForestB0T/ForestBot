import Bot            from "./structure/mineflayer/Bot.js";
import Client         from "./structure/discord/client.js";
import * as Config    from "./config.js";
export * as endpoints from "./structure/endpoints/endpoints.js";
export * as logger    from "./functions/utils/logger.js"

/**
 * Main config and colors .json files.
 */
export const { colors, config } = Config;

/**
 * @class Options
 * Main options for various functions.
 * 
 * @class Client
 * Discord bot class
 * 
 * @class Bot
 * Mineflayer bot class
 */
export const options   = new Config.Options();
export const client    = new Client(options.discord);
export const bot       = new Bot(options.mineflayer);