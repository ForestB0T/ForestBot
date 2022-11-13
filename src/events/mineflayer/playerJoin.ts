import type { Player } from "mineflayer";
import type Forestbot  from "../../structure/mineflayer/Bot";
import { client }      from "../../index.js";

export default {
    name: "playerJoined",
    once: false,
    run: async(args: any[], Bot: Forestbot) => {

        const player: Player = args[0]

        if (!Bot.isConnected) return;

        const user = {
            username: player.username,
            uuid:     player.uuid
        }

        client.chatEmbed(`> ${user.username} joined`, "green");

        const data = await Bot.endpoints.updateJoin(
            user.username,
            user.uuid,
            Bot.mc_server
        )

        if (data.oldname) {
            Bot.bot.chat(`${user.username}, previously known as ${data.oldname} joined the server.`);
            return;
        }

        if (data.newuser && Bot.welcomeMsgs) {
            Bot.bot.chat(`${user.username} joined for the first time.`)
            return;
        }

        return;
    }
}