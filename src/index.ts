import Bot              from "./structure/mineflayer/Bot.js";
import WebSocketHandler from "./structure/websocket/WebSocket.js";
import * as Config      from "./config.js";
export * as endpoints   from "./structure/endpoints/endpoints.js";
export * as logger      from "./functions/utils/logger.js"

/**
 * Main config and colors .json files.
 */

/**
 * @class Options
 * Main options for various functions.
 */
export const options = new Config.Options();

/**
 * @class Bot
 * Mineflayer bot class
 */
export const bot = new Bot(options.mineflayer);

/**
 * @class WebSocketHandler
 * Main websocket for data.
 */
export const websocket = new WebSocketHandler({
    apiKey: process.env.apiKey,
    url: "ws://localhost:5000/authenticate"
})