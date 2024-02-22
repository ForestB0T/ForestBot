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

        //we want to send ping in this report :)
        await api.websocket.sendPlayerJoin({
            username: user.username,
            uuid: user.uuid,
            timestamp: Date.now().toString(),
            server: Bot.mc_server
        })


        return;
    }
}