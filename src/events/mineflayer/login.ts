import type Bot from "../../structure/mineflayer/Bot.js"
import { Logger, api } from "../../index.js";

let intrvl: NodeJS.Timer;

export default {
    name: "login",
    once: true,
    run: async (args: [], Bot: Bot) => {
        Logger.login(`Connected to ${Bot.options.host} successfully`);

        // if (intrvl) {
        //     clearInterval(intrvl);
        // };

        // intrvl = setInterval(async () => {
        //     await api.postUpdatePlayerList({
        //         users: Bot.getPlayers(),
        //         mc_server: Bot.mc_server
        //     });

        //     await api.postSavePlaytime({
        //         players: Object.keys(Bot.bot.players),
        //         mc_server: Bot.mc_server
        //     })

        // }, 60000);


    }
}