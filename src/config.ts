import "dotenv/config";
import { readFile }           from "fs/promises";
import type { BotOptions }    from "mineflayer";
import { Logger }             from "./index.js";
import { ForestBotApiConfig } from "forestbot-api";

let config: Config = await JSON.parse(await readFile("./config.json", "utf8"));

if (
  !config ||
  !process.env.MC_USER ||
  !process.env.MC_PASS ||
  !process.env.apiKey  
) {
  throw new Error("`You are missing configuration. Please ensure correct config and environement variables are present.`");
}


export async function reloadConfig() {
  try {
    const newConfig = await JSON.parse(await readFile("./config.json", "utf8"));
    config = newConfig;
    Logger.success("Config reloaded successfully.");
  } catch (err) {
    Logger.error("Error reloading config:", err);
  }
}

export { config };

export const colors: Colors = await JSON.parse(await readFile("./json/colors.json", "utf8"));

export let mc_whitelist = (await JSON.parse(await readFile("./json/mc_whitelist.json", "utf8"))).users as string[]
export let mc_blacklist = (await JSON.parse(await readFile("./json/mc_blacklist.json", "utf8"))).users as string[]

class MineflayerOptions implements BotOptions {
  host     = config.host
  username = process.env.MC_USER
  version  = config.version
  port     = config.port
  viewDistance = 0
}

class ApiConfig implements ForestBotApiConfig {
  apiKey        = process.env.apiKey
  baseUrl       = config.api_url
  useWebsocket  = true
  webSocket_url = config.websocket_url
  mc_server     = config.mc_server
};


export class Options {
  mineflayer = new MineflayerOptions();
  api        = new ApiConfig();
}