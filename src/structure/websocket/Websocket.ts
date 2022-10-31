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
        this.wss.on("error", (err) => logger.log(err.message, "red"))
        this.wss.on("open", () => logger.log("> Connected to websocket successfully", "blue", true))
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

    // webSocketConnect() {
    //     const _wss = new WebSocket('ws://localhost:5000/ws-auth/newtest');
    //     return this.wss = _wss;
    // }

    // sendChatMessage(user: string, msg: string, mc_server: string) {
    //     console.log(msg)
    //     if (this.wss.readyState !== WebSocket.OPEN) return; 
    //     const messageToSend = JSON.stringify({ 
    //         username: user,
    //         message: msg,
    //         mc_server: mc_server
    //     })
    //     this.wss.send(messageToSend)
    // }

    // handleEvents() {
    //     this.wss.on('error', (err) => {
    //         console.log(err)
    //     })

    //     this.wss.on('close', () => {
    //         console.log("The websocket has closed")
    //     }) 

    //     this.wss.on('open', () => { 
    //         logger.log("> Connected to websocket successfully", "blue", true)
    //         this.wss.send(JSON.stringify({
    //             username: "Test2",
    //             message: "Hello this is a message",
    //             mc_server: "newtest"
    //         }))
    //     })
    // }

