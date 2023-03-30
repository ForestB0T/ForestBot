import WebSocket from "ws";
import { logger } from "../../index.js";
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
      },
    });

    this.socket.on("open", () => {
      logger.log("Websocket connected.", "green", true);

      this.connected = true;
      setInterval(() => { this.socket.ping() }, 5000)
    });

    this.socket.on("error", async (error) => {
      logger.log("Websocket has been inturrupted.", "red", true);
      console.error(error);
      await new Promise(r => setTimeout(r, config.reconnect_time));
      this.connected = false;
      this.connect();
      return;
    });

    this.socket.on("close", async () => {
      logger.log("Websocket disconnected.", "yellow", true);
    });
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
