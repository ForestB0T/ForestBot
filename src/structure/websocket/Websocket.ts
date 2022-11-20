import WebSocket from "ws";
import { logger, bot, config } from "../../index.js";

/**
 * @Class Websocket
 * @description main class for websocket
 */
export default class Websocket {
    public wss: WebSocket.WebSocket;

    constructor(public url: string) {
        this.start();
    }

    start() {
        if (!config.use_websocket) return logger.log("Websocket is disabled in config.json", "red", false);

        this.wss = new WebSocket(this.url);

        this.wss.on("error", (err) => {
            logger.log(`Websocket error: ${err.message}`, "red", true);
            this.restartWebsocket();
        })

        this.wss.on("open", () => {
            logger.log("> Connected to websocket successfully", "blue", true)
            let intrvl = setInterval(() => { 
                const playerList = bot.getPlayers(); 
                this.wss.ping();
                this.wss.send(JSON.stringify({ 
                    type: "tablist", 
                    mc_server: bot.mc_server, 
                    playerlist: JSON.stringify(playerList)
                }));

            }, 20000);

            this.wss.on("close", () => {
                logger.log("> Disconnected from websocket", "red", true);
                clearInterval(intrvl);
                return;
            })
        })
    }

    async restartWebsocket() { 
        await new Promise((resolve) => setTimeout(resolve, 10000));
        logger.log("> Attempting to reconnect to websocket", "yellow", true);
        
        if (this.wss) {
            this.wss.terminate();
        };

        this.start();
    }
}
