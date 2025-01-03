import type { Player }         from "mineflayer";
import type Forestbot          from "../../structure/mineflayer/Bot";
import { Logger, api, bot }    from "../../index.js";
import { readFile, writeFile } from "fs/promises";
import time                    from "../../functions/utils/time.js";

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

        Logger.join(user.username, user.uuid);

        await api.websocket.sendPlayerJoin({
            username: user.username,
            uuid: user.uuid,
            timestamp: Date.now().toString(),
            server: Bot.mc_server
        })

        const offlineMessages: OfflineMessage[] = (await JSON.parse(await readFile("./json/offline_messages.json", "utf-8")));
        if (!offlineMessages) {
            return;
        }

        const playerMessages = offlineMessages.filter((msg) => msg.recipient === user.username);
        if (playerMessages.length === 0) return;

        Bot.Whisper(user.username, `You have ${playerMessages.length} pending offline messages, I will send them to you now.`);
        await new Promise((resolve) => setTimeout(resolve, 3200));

        for (const msg of playerMessages) {
            await new Promise((resolve) => setTimeout(resolve, 4000));

            const niceTime = time.convertUnixTimestamp(parseInt(msg.timestamp.toString()) / 1000);
            Bot.Whisper(user.username, `From ${msg.sender}: ${msg.message} | ${niceTime}`);
        }

        const newMessages = offlineMessages.filter((msg) => msg.recipient !== user.username);
        await writeFile("./json/offline_messages.json", JSON.stringify(newMessages, null, 2));

        return;
    }
}