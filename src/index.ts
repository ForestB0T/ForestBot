export { Logger }  from "./structure/logger/Logger.js";
import Bot         from "./structure/mineflayer/Bot.js";
import * as Config from "./config.js";
import apiHandler  from "./structure/endpoints/endpoints.js";
import chalk from "chalk";

console.log(`
    ${chalk.red(`
    ███████╗ ██████╗ ██████╗ ███████╗███████╗████████╗██████╗  ██████╗ ████████╗
    ██╔════╝██╔═══██╗██╔══██╗██╔════╝██╔════╝╚══██╔══╝██╔══██╗██╔═══██╗╚══██╔══╝
    █████╗  ██║   ██║██████╔╝█████╗  ███████╗   ██║   ██████╔╝██║   ██║   ██║   
    ██╔══╝  ██║   ██║██╔══██╗██╔══╝  ╚════██║   ██║   ██╔══██╗██║   ██║   ██║   
    ██║     ╚██████╔╝██║  ██║███████╗███████║   ██║   ██████╔╝╚██████╔╝   ██║   
    ╚═╝      ╚═════╝ ╚═╝  ╚═╝╚══════╝╚══════╝   ╚═╝   ╚═════╝  ╚═════╝    ╚═╝                                                                         
    `)}


                             made by Febzey#1854
`);


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
 * @class ForestBotApiClient
 * This is the main api handler for our websocket and api endpoints.
 */
export const api = new apiHandler(options.api);