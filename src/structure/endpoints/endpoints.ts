// import { ForestBotApiClient, ForestBotApiConfig } from "forestbot-api";
import { Logger, bot } from "../../index.js";
import { config } from "../../config.js";

import { DiscordChatMessage, ForestBotAPI, ForestBotAPIOptions, NewUserData, NewUserNameData } from "forestbot-api-wrapper-v2";
import time from "../../functions/utils/time.js";

let reconnectCount = 0;

/* Milliseconds */
let websocketReconnectCooldown = 5000

export default class apiHandler extends ForestBotAPI {

   // public api: ForestBotAPI;
    constructor(options: ForestBotAPIOptions) {
        super(options)

        this.on("websocket_open", () => {
            Logger.websocket(`Websocket connection has been reopened after ${reconnectCount} reconnections!`)
            reconnectCount = 0;

            Logger.websocket("Websocket connection opened")
        });

        this.on("websocket_close", async () => {
            Logger.websocket("Websocket connection has been closed!")

            if (reconnectCount >= 5) {
                Logger.websocket("Websocket connection has been closed 5 times in a row. Will try again in 60 seconds.")
                websocketReconnectCooldown = 60000;
            }

            reconnectCount++;

            // recreate the api handler after 5 seconds
            await time.sleep(websocketReconnectCooldown);
            const newApiHandler = new apiHandler(options);
            Object.assign(this, newApiHandler);
            
            return;
        })

        this.on("websocket_error", (data: any) => {
            Logger.websocket("Websocket error: " + data)
        })

        this.on("new_name", (data: NewUserNameData) => {
            if ((data.server === bot.mc_server && config.welcome_messages)) {
                bot.bot.chat(`${data.new_name}, previously known as ${data.old_name} joined the server!`)
            }
        })

        this.on("new_user", async (data: NewUserData) => {
            if ((data.server === bot.mc_server) && config.welcome_messages) {
                await new Promise((r) => setTimeout(r, 1000));
                bot.bot.chat(`${data.user}, First time here? Welcome!`)
            }
        })

        this.on("inbound_discord_chat", (data: DiscordChatMessage) => {
            console.log(data)
            if (data.mc_server === bot.mc_server && config.allow_chatbridge_input) {
                bot.bot.chat(`[Discord] ${data.username}: ${data.message}`)
            }
        })

    };


}