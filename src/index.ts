import Bot            from "./structure/mineflayer/Bot.js";
import Client         from "./structure/discord/client.js";
import * as Conf      from "./config.js";
export * as endpoints from "./structure/endpoints/endpoints.js";

export const { colors, config } = Conf;
export const options  = new Conf.default();
export const client   = new Client(options.discord); 
export const bot      = new Bot(options.mineflayer);