import mineflayer from "mineflayer";
import mc from "minecraft-protocol";
import { readFile, readdir } from "fs/promises";
import { endpoints, logger } from "../../index.js";
import { config } from "../../config.js";
import * as fs from "fs";
import time from "../../functions/utils/time.js";
import WebSocketHandler from "../websocket/WebSocket.js";
const { ping } = mc;

/**
 * @class Bot
 * Main class for mineflayer bot.
 */
export default class Bot {

    public bot: mineflayer.Bot;
    public userWhitelist: Set<string> = new Set();
    public userBlacklist: Set<string> = new Set();
    public whitelistedCmds: Set<string> = new Set();
    public commands: Map<string, MCommand> = new Map();
    public useWhitelist: boolean;
    public welcomeMsgs: boolean;
    public mc_server: string;
    public restartCount: number = 0;
    public isConnected: boolean;
    public allowConnection: boolean = true;
    public endpoints: endpoints
    public apiWebSockets: Map<string, WebSocketHandler> = new Map();

    constructor(public options: mineflayer.BotOptions) {

        this.useWhitelist = config.use_mc_whitelist
        this.mc_server = config.mc_server
        this.welcomeMsgs = config.welcome_messages
        this.endpoints = endpoints.default

        config.mc_blacklist.forEach(user => this.userBlacklist.add(user));
        config.mc_whitelist.forEach(user => this.userWhitelist.add(user));
        config.whitelisted_commands.forEach(command => this.whitelistedCmds.add(command));

        this.startBot();
        this.loadCommands();
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

        if (this.restartCount >= 10) {
            logger.log("> Connection is being refused, The server is most likely offline.", "red", true)
            this.restartCount = 0;
            setTimeout(() => { this.startBot() }, 9 * 60000)
            return
        }


        logger.log("> Attempting to start mineflayer bot", "yellow", true);

        try {
            const res = await ping({ host: this.options.host, port: this.options.port });
            if (!res) throw new Error("No Response.");
        } catch (err) {
            await time.sleep(config.reconnect_time);
            this.startBot();
            return;
        }

        if (!(await this.endpoints.pingApi())) {
            logger.log(`> Connection to api failed, maybe the api is offline?`, "red", true);
            this.endAndRestart();
            return;
        } else {
            logger.log("> Connection to api successful", "green", true)

            if (config.websockets.enabled) {
                for (const urlObj of config.websockets.urls) {
                    if (this.apiWebSockets.has(urlObj.id)) continue;
                    this.apiWebSockets.set(urlObj.id, new WebSocketHandler({ url: `${config.websockets.hostUrl}/${urlObj.url}`, apiKey: process.env.apiKey }))
                }
            }
        }

        const bot = mineflayer.createBot({ ...this.options, auth: "microsoft" });

        this.handleEvents(bot);
        this.loadPatterns(bot);

        const newChat = bot.chat;
        const chatPrefix = config.useCustomChatPrefix ? config.customChatPrefix : "";

        bot.chat = (msg: string) => {
            newChat(`${chatPrefix} ${msg}`)
        }

        bot.whisper = (user: string, msg: string) => {
            newChat(`${chatPrefix} ${msg}`)
        }

        this.bot = bot;
        return bot;
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
     * @returns [{ name: string, ping: number }]
     */
    public getPlayers(): [{ name: string, ping: number }] {
        let arr = []

        for (const player of Object.keys(this.bot.players)) {
            arr.push({ name: player, ping: this.bot.players[player].ping });
        }
        return arr as [{ name: string, ping: number }];
    }

    /**
     * Closing existing connections for endpoints that use websockets.
     */
    public closeWebsockets() {
        for (const [id, websocket] of this.apiWebSockets.entries()) {
            websocket.send({ close: true });
            websocket.socket.close();
            this.apiWebSockets.delete(id);
        }
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
                type === "whitelist" ? this.userWhitelist.add(user) : this.userBlacklist.add(user);
                break;
            }
            case "remove": {
                const index = list.users.indexOf(user);
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
     * Load and register custom chat patterns,
     * patterns are located in a patterns.json file.
     * 
     * @param bot mineflayer.bot
     */
    private async loadPatterns(bot: Bot["bot"]) {
        const patterns = JSON.parse(await readFile("./json/patterns.json", { encoding: "utf-8" }));
        for (const pattern of patterns.patterns) {
            if (pattern.disabled) continue;
            bot.addChatPattern(pattern.name, new RegExp(pattern.regex), pattern.options);
        }
    }


    /**
     * 
     * Load all commands in the commands folder,
     * then add them to a map to be later used in the command handler.
     * 
     */
    private async loadCommands() {
        for (const file of (await readdir("./build/commands")).filter(file => file.endsWith(".js"))) {
            const module: MCommand = (await import(`../../commands/${file}`)).default;
            this.commands.set(module.commands[0], module);
        }
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
    }


}
