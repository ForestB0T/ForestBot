import type { Player } from "mineflayer";
import type Forestbot from "../../structure/mineflayer/Bot";
import { Logger, api } from "../../index.js";

export default {
    name: "playerJoined",
    once: false,
    run: async (args: any[], Bot: Forestbot) => {

        const player: Player = args[0]

        if (!Bot.isConnected) return;

        const user = {
            username: player.username,
            uuid: player.uuid
        }

        Logger.join(user.username,user.uuid);

        // websocket.send({
        //     type: "minecraft",
        //     action: "savejoin",
        //     data: {
        //         user: user.username,
        //         uuid: user.uuid,
        //         mc_server: Bot.mc_server,
        //         time: `${Date.now()}`
        //     },
        //     mcServer: Bot.mc_server
        // })

        const saveUserJoinParams = {
            type: "minecraft",
            action: "savejoin",
            data: {
                user: user.username,
                uuid: user.uuid,
                mc_server: Bot.mc_server,
                time: `${Date.now()}`
            },
            mcServer: Bot.mc_server
        }

        api.saveJoin(saveUserJoinParams)


        return;
    }
}