// import { ForestBotApiClient, ForestBotApiConfig } from "forestbot-api";
import { Logger, bot } from "../../index.js";
import { config } from "../../config.js";

import { DiscordChatMessage, ForestBotAPI, ForestBotAPIOptions, NewUserData, NewUserNameData } from "forestbot-api-wrapper-v2";

export default class apiHandler extends ForestBotAPI {

   // public api: ForestBotAPI;
    constructor(options: ForestBotAPIOptions) {
        super(options)

        this.on("websocket_open", () => {
            Logger.websocket("Websocket connection opened")
        });

        this.on("websocket_close", (data: any) => {
            Logger.websocket("Websocket connection has been closed!")
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