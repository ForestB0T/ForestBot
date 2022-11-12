import Bot from "./structure/mineflayer/Bot.js";
import Client from "./structure/discord/client.js";
import Websocket from "./structure/websocket/Websocket.js";
import * as Config from "./config.js";
export * as endpoints from "./structure/endpoints/endpoints.js";
export * as logger from "./functions/utils/logger.js"

/**
 * Main config and colors .json files.
 */
export const { colors, config } = Config;

/**
 * @class Options
 * Main options for various functions.
 */
export const options = new Config.Options();

/**
 * @class Client
 * Discord bot class
 */
export const client = new Client(options.discord);

/**
 * @class Bot
 * Mineflayer bot class
 */
export const bot = new Bot(options.mineflayer);

/**
 * @class Websocket
 * Main websocket class for mineflayer bot.
 */
export const websocket = new Websocket(options.websocketUrl);