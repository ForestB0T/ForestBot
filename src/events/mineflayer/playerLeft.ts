import type { Player } from "mineflayer";
import type Forestbot  from "../../structure/mineflayer/Bot";
import { websocket }      from "../../index.js";
import chalk from "chalk";

export default {
    name: "playerLeft",
    once: false,
    run: async (args: any[], Bot: Forestbot) => {

        const player: Player = args[0];

        const user = {
            username: player.username,
            uuid:     player.uuid
        }

        websocket.send({
            type: "minecraft",
            action: "saveleave",
            data: {
                username: user.username,
                mc_server: Bot.mc_server,
                time: `${Date.now()}`
            },
            mcServer: Bot.mc_server
        })

        return;
    }
}