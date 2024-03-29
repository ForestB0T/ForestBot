// import { ForestBotApiClient, ForestBotApiConfig } from "forestbot-api";
import { Logger, bot } from "../../index.js";
import { config } from "../../config.js";

import { ForestBotAPI, ForestBotAPIOptions } from "forestbot-api-wrapper-v2";

export default class apiHandler extends ForestBotAPI {

    public api: ForestBotAPI;
    constructor(options: ForestBotAPIOptions) {
        super(options)

        this.on("websocket_open", () => {
            console.log("websocket opened.")
        });

        this.on("websocket_error", (data: any) => {
            console.log("WEBSOCKET_ERROR: ", data);
        })

        this.on("new_name", (data) => {
            if ((data.server === bot.mc_server && config.welcome_messages)) {
                bot.bot.chat(`${data.user.new_name}, previously known as ${data.user.old_name} joined the server!`)
            }
        })

        this.on("new_user", async (data) => {
            if ((data.server === bot.mc_server) && config.welcome_messages) {
                await new Promise((r) => setTimeout(r, 1000));
                bot.bot.chat(`This is my first time seeing you, ${data.user.username}, so welcome!`)
                await new Promise((r) => setTimeout(r, 2000));
                bot.bot.chat(`/msg ${data.user.username} Use !help to learn more about me and what I can do!`);
            }
        })

    };


}