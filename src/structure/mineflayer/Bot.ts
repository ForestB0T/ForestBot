import mineflayer            from "mineflayer";
import { ping }              from "minecraft-server-ping";
import { readFile, readdir } from "fs/promises";
import { config, endpoints, logger, websocket } from "../../index.js";

/**
 * @class Bot
 * Main class for mineflayer bot.
 */
export default class Bot {
    
    public bot              : mineflayer.Bot;
    public userWhitelist    : Set<string> = new Set();
    public userBlacklist    : Set<string> = new Set();
    public disabledCommands : Set<string> = new Set();
    public whitelistedCmds  : Set<string> = new Set();
    public commands         : Map<string, MCommand> = new Map();
    public useCommands      : boolean;
    public useWhitelist     : boolean;
    public welcomeMsgs      : boolean;
    public mc_server        : string;
    public restartCount     : number = 0;
    public isConnected      : boolean;
    public endpoints        : endpoints
    
    constructor(public options: mineflayer.BotOptions) {

        this.useCommands  = config.useCommands;
        this.useWhitelist = config.use_mc_whitelist
        this.mc_server    = config.mc_server
        this.welcomeMsgs  = config.welcome_messages
        this.endpoints    = endpoints.default

        config.disabled_commands.forEach(command => this.disabledCommands.add(command));
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
    public startBot = async () => {
        logger.log("> Attempting to start mineflayer bot", "yellow", true)
        this.restartCount++;

        if (this.restartCount >= 10) {
            logger.log("> Connection is being refused, bot made too many attempts to reconnect.", "red", true)
            return process.exit(1);
        }

        try { 
            await this.pingServer()
        } catch { 
            logger.log(`> Connection to ${this.options.host} failed, maybe the server is offline?`, "red", true);
            return;
        }

        const _bot = mineflayer.createBot({ ...this.options, auth: "microsoft" });

        this.handleEvents(_bot);
        this.loadPatterns(_bot);
        
        _bot.whisper = (user: string, msg: string) => this.bot.chat(`/w ${user} ${msg} [w]`);

        return this.bot = _bot;
    }


    /**
     * 
     * Ends the bot gracefully and attempts to 
     * call the bot.startBot() function.
     * 
     */
    public endAndRestart = async () => {
        if (this.isConnected) {
            this.bot.end();
            this.bot.quit();
            this.isConnected = false
        }

        await new Promise((resolve) => setTimeout(resolve, config.reconnect_time));
        this.startBot()
        websocket.start();
    }

    /**
     * Get an array of players, and their ping.
     * @returns [{ name: string, ping: number }]
     */
    getPlayers() {
        const arr = [];
        for (const player of Object.keys(this.bot.players)) {
            arr.push({ name: player, ping: this.bot.players[player].ping });
        }
        return arr
    }
 
    /**
     * 
     * Pings the server to check if it's online.
     * 
     * @returns Promise<unknown>
     */
    private pingServer = () =>
        new Promise(async (resolve, reject) => {
            try { await ping(this.options.host, this.options.port); resolve(true); }
            catch(err) { reject(err) }
        })


    /**
     * 
     * Load and register custom chat patterns,
     * patterns are located in a patterns.json file.
     * 
     * @param bot mineflayer.bot
     */
    private async loadPatterns(bot: Bot["bot"]) {
        const patterns = JSON.parse(await readFile("./patterns.json", { encoding: "utf-8" }));
        for (const pattern of patterns.patterns) {
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
            const file  = await import(`../../events/mineflayer/${File}`);
            const event = file.default;
            event.once
            ?  bot.once(event.name, (...args: any) => event.run([...args], this))
            :  bot.on(event.name, (...args: any) => event.run([...args], this))
        }
    }


}
