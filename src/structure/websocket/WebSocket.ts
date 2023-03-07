import WebSocket from "ws";
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
      console.log("WebSocket connected");
      this.connected = true;
      setInterval(() => { this.socket.ping() }, 5000)
    });

    this.socket.on("error", (error) => {
      console.error(error);
      this.connected = false;
    });

    this.socket.on("close", async () => {
      console.log("WebSocket disconnected");
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
