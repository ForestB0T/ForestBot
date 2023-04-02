import WebSocket from "ws";
import { logger, bot } from "../../index.js";
import { config } from "../../config.js";
interface WebSocketHandlerOptions {
  url: string;
  apiKey: string;
}

export default class WebSocketHandler {
  public socket: WebSocket;
  private apiKey: string;
  private url: string
  public connected: boolean = false;

  constructor(options: WebSocketHandlerOptions) {
    const { url, apiKey } = options;

    this.url = url;
    this.apiKey = apiKey;
    this.connect();
  }

  public async connect() {
    this.socket = new WebSocket(this.url, {
      headers: {
        "x-api-key": this.apiKey,
        "client-type": "minecraft",
        "client-id": bot.mc_server
      },
    });

    this.socket.on("open", () => {
      logger.log("Websocket connected.", "green", true);

      this.connected = true;
      setInterval(() => { this.socket.ping(1000) }, 5000)
    });

    this.socket.on("error", async (error) => {
      logger.log("Websocket has been inturrupted.", "red", true);
      console.error(error);
      return;
    });

    this.socket.on("close", async (reason) => {
      logger.log("Websocket disconnected." + reason, "yellow", true);
      await new Promise(r => setTimeout(r, 10000));
      this.connected = false;
      this.connect();
    });

    this.socket.on("message", (msg) => {
      const data = JSON.parse(msg.toString());
    
      if (data.action === "chat") {
        if (!config.allow_chatbridge_input) return;
        bot.bot.chat(`${data.data.username} » ${data.data.message}`)
      }

      if (data.data.name_changed) {
        bot.bot.chat(`${data.data.new_name}, previously known as ${data.data.old_name} joined.`);
      }

      if (data.data.new_user) {
        bot.bot.chat(`${data.data.username} joined for the first time.`);
      }

    })

  }

  send(data: any) {
    const message = JSON.stringify(data);
    this.socket.send(message);
    return
  }

  close() {
    this.socket.close();
  }
}
