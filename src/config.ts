import "dotenv/config";
import { readFile }        from "fs/promises";
import type { BotOptions } from "mineflayer";
import type { ClientOptions, PartialTypes} from 'discord.js';
import { Intents }                         from 'discord.js';

export const config: Config = await JSON.parse(await readFile("./config.json", "utf8"));
export const colors: Colors = await JSON.parse(await readFile("./json/colors.json", "utf8"));

config.mc_whitelist = (await JSON.parse(await readFile("./json/mc_whitelist.json", "utf8"))).users;
config.mc_blacklist = (await JSON.parse(await readFile("./json/mc_blacklist.json", "utf8"))).users;

class MineflayerOptions implements BotOptions {
        host     = process.env.MC_HOST
        username = process.env.MC_USER
        //password = process.env.MC_PASS
        version  = process.env.MC_VERSION
        port     = parseInt(process.env.MC_PORT)
       // disableChatSigning = false
}

class DiscordOptions implements ClientOptions {
    token = process.env.token
    partials: PartialTypes[] = ['CHANNEL']
    intents = [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_MESSAGES,

    ]
    disabledCommands: string[] = []
}

export class Options {
    mineflayer = new MineflayerOptions();
    discord    = new DiscordOptions();
}