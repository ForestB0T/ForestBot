import "dotenv/config";
import { readFile }        from "fs/promises";
import type { BotOptions } from "mineflayer";
import type { ClientOptions, PartialTypes} from 'discord.js';
import { Intents }                         from 'discord.js';
import { ServerOptions } from "ws";

const config: Config = await JSON.parse(await readFile("./config.json", "utf8"));
const colors: Colors = await JSON.parse(await readFile("./colors.json", "utf8"));

class MineflayerOptions implements BotOptions {
        host     = process.env.MC_HOST
        username = process.env.MC_USER
        password = process.env.MC_PASS
        version  = process.env.MC_VERSION
        port     = parseInt(process.env.MC_PORT)
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

class WebSocketOptions implements ServerOptions {
    port: number = config.websocket_port
    path: string = config.websocket_path
}

class Options {
    mineflayer = new MineflayerOptions();
    discord    = new DiscordOptions();
    websocket  = new WebSocketOptions();
}

export { config, colors, Options };