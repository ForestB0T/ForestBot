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
        if(!config.use_websocket) { 
            return logger.log("Websocket is disabled in config.json", "red", false);
        }
        this.wss = new WebSocket(this.url);
        this.wss.on("error", (err) => {
            logger.log(`Websocket error: ${err.message}`, "red", true);
            setTimeout(() => {
                this.start();
            }, 10000);
        })
        this.wss.on("open", () => {
            let intrvl = setInterval(() => { this.wss.ping() }, 30000);
            logger.log("> Connected to websocket successfully", "blue", true)
        
            this.wss.on("close", () => {
                logger.log("> Disconnected from websocket", "red", true);
                clearInterval(intrvl);
                setTimeout(() => {
                    this.start();
                }, 10000);
                return;
            })
        })
        this.wss.on("message", (data) => {
            const json = JSON.parse(data.toString());  
            if (json.type && json.type === "tablist") {
                logger.log("> Tablist requested.", "blue", false)
                const playerList = bot.getPlayers()
                this.wss.send(JSON.stringify(playerList));
            }
        })
    }
}
