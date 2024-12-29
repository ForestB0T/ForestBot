import {
    config,
    mc_blacklist,
    mc_whitelist,
    reloadConfig
} from "../../config.js";
import { readdir } from "fs/promises";
import { Logger } from "../../index.js";
import mineflayer from "mineflayer";
import mc from "minecraft-protocol";
import * as fs from "fs";
import time from "../../functions/utils/time.js";
import { Player } from "forestbot-api-wrapper-v2";


const { ping } = mc;

/**
 * @class Bot
 * Main class for mineflayer bot.
 */
export default class Bot {

    public bot: mineflayer.Bot;

    public useWhitelist: boolean;
    public welcomeMsgs: boolean;
    public mc_server: string;

    public userWhitelist: Set<string> = new Set();
    public userBlacklist: Set<string> = new Set();
    public whitelistedCmds: Set<string> = new Set();
    public commands: Map<string, MCommand> = new Map();

    public restartCount: number = 0;
    public isConnected: boolean = false;
    public allowConnection: boolean = true;

    constructor(public options: mineflayer.BotOptions) {
        this.loadConfigs()
        this.startBot()
    }

    public async loadConfigs() {
        await reloadConfig();
        this.useWhitelist = config.use_mc_whitelist;
        this.mc_server = config.mc_server;
        this.welcomeMsgs = config.welcome_messages;

        mc_blacklist.forEach(user => this.userBlacklist.add(user));
        mc_whitelist.forEach(user => this.userWhitelist.add(user));
        config.whitelisted_commands.forEach(command => this.whitelistedCmds.add(command));

        Logger.info("Loaded Configs - Blacklist: " + this.userBlacklist.size + " Whitelist: " + this.userWhitelist.size + " Whitelisted Commands: " + this.whitelistedCmds.size);
    }

    /**
     * 
     * Start the mineflayer bot
     * 
     * @returns this.bot = bot;
     */
    public async startBot() {
        if (!this.allowConnection) return;
        this.restartCount++;

        Logger.login("Attempting to start mineflayer bot");

        if (this.restartCount >= 10) {
            Logger.warn("Minecraft Server Connection is being refused, The server is most likely offline.");
            this.restartCount = 0;
            setTimeout(() => { this.startBot() }, 10 * 60000)
            return
        }

        try {
            const res = await ping({ host: this.options.host, port: this.options.port });
            if (!res) throw new Error("No Response.");
        } catch (err) {
            await time.sleep(config.reconnect_time);
            this.startBot();
            return;
        }

        const bot = mineflayer.createBot({ ...this.options, auth: "microsoft" });

        this.loadCommands();
        this.handleEvents(bot);

        return this.bot = bot;
    }


    public Whisper(user: string, message: string) { 
        this.bot.chat(`/${config.whisperCommand} ${user} ${message}`);
    }

    /**
     * 
     * Ends the bot gracefully and attempts to 
     * call the bot.startBot() function.
     * 
     */
    public endAndRestart = async () => {
        if (this.isConnected) {
            this.isConnected = false
        }

        await new Promise((resolve) => setTimeout(resolve, config.reconnect_time));
        this.startBot();
    }

    /**
     * Get an array of players, and their ping.
     * @returns [{ username: string, uuid: string, latency: number, server: string }]
     */
    public getPlayers(): Player[] {
        let players: Player[] = []
        for (const player of Object.values(this.bot.players)) {
            players.push({
                username: player.username,
                uuid: player.uuid,
                latency: player.ping,
                server: this.mc_server,
            })
        }
        return players;
    }


    /**
     * Add a player to the whitelist.
     */
    public async updateLists(user: string, action: "add" | "remove", type: "blacklist" | "whitelist") {
        const filePath = type === "whitelist" ? "./json/mc_whitelist.json" : "./json/mc_blacklist.json";
        const fileContents = await fs.promises.readFile(filePath, "utf8");
        const list = JSON.parse(fileContents);

        switch (action) {
            case "add": {
                list.users.push(user);
                Logger.info(`User: ${user} has been added to ${type}`);
                type === "whitelist" ? this.userWhitelist.add(user) : this.userBlacklist.add(user);
                break;
            }
            case "remove": {
                const index = list.users.indexOf(user);
                Logger.info(`User: ${user} has been removed from ${type}`);
                if (index !== -1) {
                    list.users.splice(index, 1);
                    type === "whitelist" ? this.userWhitelist.delete(user) : this.userBlacklist.delete(user);
                }
                break;
            }
        }

        await fs.promises.writeFile(filePath, JSON.stringify(list, null, 2));

        return;
    }


    /**
     * 
     * Load all commands in the commands folder,
     * then add them to a map to be later used in the command handler.
     * 
     * 
     */
    private async loadCommands() {
        for (const file of (await readdir("./build/commands")).filter(file => file.endsWith(".js"))) {
            const module: MCommand = (await import(`../../commands/${file}`)).default;
            this.commands.set(module.commands[0], module);
        }
        Logger.success(`Loaded commands. Total: ${this.commands.size}`);
    }

    /**
     * 
     * Load and handle mineflayer events.
     * 
     * @param bot mineflayer bot
     * @returns void
     */
    private async handleEvents(bot: Bot["bot"]) {
        for (const File of (await readdir('./build/events/mineflayer')).filter(file => file.endsWith('.js'))) {
            const file = await import(`../../events/mineflayer/${File}`);
            const event = file.default;
            if (config.disabled_events.includes(event.name)) continue;
            event.once
                ? bot.once(event.name, (...args: any) => event.run([...args], this))
                : bot.on(event.name, (...args: any) => event.run([...args], this))
        }
        Logger.success(`Loaded Mineflayer Events`);
    }


}
