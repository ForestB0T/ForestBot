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

        await api.websocket.sendPlayerLeave({
            username: user.username,
            uuid: user.uuid,
            timestamp: Date.now().toString(),
            server: Bot.mc_server
        })

        return;
    }
}