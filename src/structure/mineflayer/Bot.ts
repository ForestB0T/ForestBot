import { 
    config, 
    mc_blacklist,
    mc_whitelist }           from "../../config.js";
import { readdir }           from "fs/promises";
import { Logger, api }       from "../../index.js";
import mineflayer            from "mineflayer";
import mc                    from "minecraft-protocol";
import * as fs               from "fs";
import time                  from "../../functions/utils/time.js";


const { ping } = mc;

/**
 * @class Bot
 * Main class for mineflayer bot.
 */
export default class Bot {

    public bot: mineflayer.Bot;

    public readonly useWhitelist: boolean;
    public readonly welcomeMsgs:  boolean;
    public readonly mc_server:    string;

    public userWhitelist:   Set<string>           = new Set();
    public userBlacklist:   Set<string>           = new Set();
    public whitelistedCmds: Set<string>           = new Set();
    public commands:        Map<string, MCommand> = new Map();
    
    public restartCount:    number  = 0;
    public isConnected:     boolean = false;
    public allowConnection: boolean = true;

    constructor(public options: mineflayer.BotOptions) {
        this.useWhitelist = config.use_mc_whitelist;
        this.mc_server    = config.mc_server;
        this.welcomeMsgs  = config.welcome_messages;

        mc_blacklist.forEach(user => this.userBlacklist.add(user));
        mc_whitelist.forEach(user => this.userWhitelist.add(user));
        config.whitelisted_commands.forEach(command => this.whitelistedCmds.add(command));

        this.startBot();
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
            setTimeout(() => { this.startBot() }, 9 * 60000)
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

        if (!(await api.pingApi())) {
            Logger.warn(`Connection to "${config.api_url}" api failed, maybe the api is offline? Attempting to restart...`);
            this.endAndRestart();
            return;
        } else {
            Logger.success("Connection to api successful");
        }

        const bot = mineflayer.createBot({ ...this.options, auth: "microsoft" });

        this.loadCommands();
        this.handleEvents(bot);

        const newChat = bot.chat;
        const chatPrefix = config.useCustomChatPrefix ? config.customChatPrefix : "";

        bot.chat = (msg: string) => {
            newChat(`${chatPrefix}${msg}`)
        }

        bot.whisper = (user: string, msg: string) => {
            newChat(`${chatPrefix}${msg}`)
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
