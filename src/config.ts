import "dotenv/config";
import { readFile } from "fs/promises";
import type { BotOptions } from "mineflayer";
import { Logger } from "./index.js";
import type { ForestBotAPIOptions } from "forestbot-api-wrapper-v2";

const colors: Colors = await JSON.parse(await readFile("./json/colors.json", "utf8"));
let config: Config = await JSON.parse(await readFile("./config.json", "utf8"));
let mc_whitelist = (await JSON.parse(await readFile("./json/mc_whitelist.json", "utf8"))).users as string[]
let mc_blacklist = (await JSON.parse(await readFile("./json/mc_blacklist.json", "utf8"))).users as string[]

if (
  !config ||
  !process.env.MC_USER ||
  !process.env.MC_PASS ||
  !process.env.apiKey
) {
  throw new Error("`You are missing configuration. Please ensure correct config and environement variables are present.`");
}

/**
 * Reload the config file and update the whitelist and blacklist.
 * @returns {Promise<void>}
 */
async function reloadConfig() {
  try {
    const newConfig: Config = await JSON.parse(await readFile("./config.json", "utf8"));
    const newWhitelist = (await JSON.parse(await readFile("./json/mc_whitelist.json", "utf8"))).users as string[]
    const newBlacklist = (await JSON.parse(await readFile("./json/mc_blacklist.json", "utf8"))).users as string[]

    mc_whitelist = newWhitelist;
    mc_blacklist = newBlacklist;
    config = newConfig;

    Logger.success("Config reloaded successfully.");
    return

  } catch (err) {
    Logger.error("Error reloading config:", err);
    return
  }
}

class MineflayerOptions implements BotOptions {
  host = config.host
  username = process.env.MC_USER
  version = config.version
  port = config.port
  viewDistance = 0
  closeTimeout = 60000

  disableChatSigning = false
  checkTimeoutInterval = 60000
 
}

class ApiConfig implements ForestBotAPIOptions {
  apiUrl = config.api_url
  isBotClient = true
  websocket_url = config.websocket_url
  apiKey = process.env.apiKey
  logerrors = true
  use_websocket = true
  mc_server = config.mc_server
};

export class Options {
  mineflayer = new MineflayerOptions();
  api = new ApiConfig();
}

export { config, mc_blacklist, mc_whitelist, reloadConfig };
