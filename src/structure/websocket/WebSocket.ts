import WebSocket from "ws";

interface WebSocketHandlerOptions {
  url: string;
  apiKey: string;
}

export default class WebSocketHandler {
  public socket: WebSocket;
  private apiKey: string;

  constructor(options: WebSocketHandlerOptions) {
    const { url, apiKey } = options;

    this.socket = new WebSocket(url, {
      headers: {
        "x-api-key": apiKey,
      },
    });

    this.apiKey = apiKey;

    this.socket.on("open", () => {
      console.log("WebSocket connected");
    });

    this.socket.on("error", (error) => {
      console.error(error);
    });

    this.socket.on("close", () => {
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
