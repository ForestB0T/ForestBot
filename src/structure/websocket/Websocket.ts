import WebSocket from "ws";
import { logger } from "../../index.js";

/**
 * @Class Websocket
 * @description main class for websocket
 */

export default class Websocket {
    public wss: WebSocket = undefined;

    constructor() {
        this.webSocketConnect();
        this.handleEvents()
    }

    webSocketConnect() {
        const _wss = new WebSocket('ws://localhost:5000/test/newtest');
        return this.wss = _wss;
    }

    sendChatMessage(user: string, msg: string, mc_server: string) {
        console.log(msg)
        if (this.wss.readyState !== WebSocket.OPEN) return; 
        const messageToSend = JSON.stringify({ 
            username: user,
            message: msg,
            mc_server: mc_server
        })
        this.wss.send(messageToSend)
    }

    handleEvents() {
        this.wss.on('error', (err) => {
            console.log(err)
        })
        
        this.wss.on('close', () => {
            console.log("The websocket has closed")
        }) 

        this.wss.on('open', () => { 
            logger.log("> Connected to websocket successfully", "blue", true)
            this.wss.send(JSON.stringify({
                username: "Test2",
                message: "Hello this is a message",
                mc_server: "newtest"
            }))
        })
    }

}