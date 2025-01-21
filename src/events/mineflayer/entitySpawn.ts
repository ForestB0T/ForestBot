import type Forestbot from "../../structure/mineflayer/Bot";
import { Logger }     from "../../index.js";

const seenPlayerList = new Set<string>();

export default {
    name: "entitySpawn",
    once: false,
    run: async (args: any[], Bot: Forestbot) => {

        const entity = args[0]

        if (entity.type != "player") return;

        const uuid = entity.uuid;
        const username = entity.username;

        if (entity.username === Bot.bot.username) return;
        if (seenPlayerList.has(uuid)) return;
        seenPlayerList.add(uuid);

        let { x, y, z } = entity.position as { x: number, y: number, z: number };

        x = Math.round(x * 10) / 10;
        y = Math.round(y * 10) / 10;
        z = Math.round(z * 10) / 10;

        Logger.world(`[${username}] (${x}, ${y}, ${z}) Spotted.`); 

        setTimeout(() => {
            seenPlayerList.delete(uuid)
        }, 500000)
    }
}