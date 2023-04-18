import type { Player } from "mineflayer";
import type Forestbot  from "../../structure/mineflayer/Bot";
import { Logger, api }      from "../../index.js";

export default {
    name: "playerLeft",
    once: false,
    run: async (args: any[], Bot: Forestbot) => {

        const player: Player = args[0];

        const user = {
            username: player.username,
            uuid:     player.uuid
        }

        Logger.leave(user.username, user.uuid);

        // websocket.send({
        //     type: "minecraft",
        //     action: "saveleave",
        //     data: {
        //         username: user.username,
        //         mc_server: Bot.mc_server,
        //         time: `${Date.now()}`
        //     },
        //     mcServer: Bot.mc_server
        // })

        const saveUserLeaveParams = {
            type: "minecraft",
            action: "saveleave",
            data: {
                username: user.username,
                mc_server: Bot.mc_server,
                time: `${Date.now()}`
            },
            mcServer: Bot.mc_server
        }

        api.saveLeave(saveUserLeaveParams);

        return;
    }
}