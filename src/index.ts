import Bot from "./structure/mineflayer/Bot.js";
import Client from "./structure/discord/client.js";
import Websocket from "./structure/websocket/Websocket.js";
import * as Conf from "./config.js";
export * as endpoints from "./structure/endpoints/endpoints.js";
export * as logger from "./functions/utils/logger.js"

/**
 * Main config and colors .json files.
 */
const { colors, config, Options } = Conf;

/**
 * @class Options
 * Main options for various functions.
 */
const options = new Options();

/**
 * @class Client
 * Discord bot class
 */
const client = new Client(options.discord);

/**
 * @class Bot
 * Mineflayer bot class
 */
const bot = new Bot(options.mineflayer);

/**
 * @class Websocket
 * Main websocket class for mineflayer bot.
 */
const websocket = new Websocket(options.websocketUrl);

export {
    colors,
    config,
    options,
    client,
    bot,
    websocket
};