import { ForestBotApiClient, ForestBotApiConfig } from "forestbot-api";
import { Logger, bot } from "../../index.js";
import { config } from "../../config.js";

interface SaveChatParams {
    type: string,
    action: string,
    data: {
        name: string,
        message: string,
        mc_server: string,
        uuid: string
    },
    mcServer: string
}

interface SaveAdvancementArgs {
    type: string,
    action: string,
    data: {
        username: string,
        advancement: string,
        mc_server: string,
        time: number,
        uuid: string
    }
}

interface SaveKillOrDeathArgs {
    type: string,
    action: string,
    data: {
        victim: string,
        death_message: string,
        time: number,
        type: string,
        mc_server: string,
        victimUUID: string,
        murdererUUID: string,
    },
    mcServer: string
}

interface SaveUserJoinParams {
    type: string,
    action: string,
    data: {
        user: string,
        uuid: string,
        mc_server: string,
        time: string,
    },
    mcServer: string
}

interface SaveUserLeaveParams {
    type: string,
    action: string,
    data: {
        username: string,
        mc_server: string,
        time: string,
    },
    mcServer: string
}

interface BotErrorParams {
    type: string,
    action: string,
    data: {
        mc_server: string,
        time: string,
    },
    mcServer: string
}

export default class apiHandler extends ForestBotApiClient {

    constructor(params: ForestBotApiConfig) {
        super(params)

        if (params.useWebsocket && params.webSocket_url) {

            this.Socket.on("open", () => {
                this.Socket.isConnected = true;
                Logger.success("Websocket connected.")
            });

            this.Socket.on("closed", async (reason: number) => {
                Logger.error(`Websocket Disconnected: Code: ${reason}`);
                this.Socket.isConnected = false;
                await new Promise(r => setTimeout(r, 10000));
                this.Socket.authenticate();
            });

            this.Socket.on("chat", (data) => {
                if (!bot.isConnected || !config.allow_chatbridge_input) return;
                const { username, message } = data;
                bot.bot.chat(`${username}: ${message}`);
                return
            });

            this.Socket.on("nameChange", (new_name, old_name) => {
                if (!config.welcome_messages || !bot.isConnected) return;
                bot.bot.chat(`${new_name} previously known as ${old_name} joined the server.`)
                return;
            })

            this.Socket.on("newUser", (username) => {
                if (!config.welcome_messages || !bot.isConnected) return;
                bot.bot.chat(`Hello, ${username} this is my first time seeing you. Welcome!`)
                return
            })

        }
    };

    private async websocketSend(data: any) {
        if (!this.Socket.isConnected) return;
        this.Socket.send(data)
    };

    public saveChat(params: SaveChatParams) {
        this.websocketSend(params);
    };

    public saveAdvancement(params: SaveAdvancementArgs) {
        this.websocketSend(params)
    };

    public saveKillOrDeath(params: SaveKillOrDeathArgs) {
        this.websocketSend(params)
    };

    public saveJoin(params: SaveUserJoinParams) {
        this.websocketSend(params);
    }

    public saveLeave(params: SaveUserLeaveParams) {
        this.websocketSend(params)
    };

    public reportProblem(params: BotErrorParams) {
        this.websocketSend(params)
    };

};