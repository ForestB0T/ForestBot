import "dotenv/config";
import { readFile }        from "fs/promises";
import type { BotOptions } from "mineflayer";


let config: Config = await JSON.parse(await readFile("./config.json", "utf8"));

export async function reloadConfig() {
  try {
    const newConfig = await JSON.parse(await readFile("./config.json", "utf8"));
    config = newConfig;
    console.log("Config reloaded successfully.");
  } catch (err) {
    console.error("Error reloading config:", err);
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

export class Options {
    mineflayer = new MineflayerOptions();
    websocket_url = config.websocket_url
}