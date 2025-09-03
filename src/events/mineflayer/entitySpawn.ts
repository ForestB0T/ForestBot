import type Forestbot from "../../structure/mineflayer/Bot";
import { Logger } from "../../index.js";

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

        const messages = [
            (username: string) => `/msg ${username} Hello ${username}, Good day!`,
            (username: string) => `/msg ${username} Hope you're doing well today!`,
            (username: string) => `/msg ${username} Just wanted to say hi!`,
            (username: string) => `/msg ${username} Hello, ${username}!`,
            (username: string) => `/msg ${username} Hi there, ${username}!`,
            (username: string) => `/msg ${username} Greetings, ${username}!`,
            (username: string) => `/msg ${username} Hey ${username}, welcome!`,
            (username: string) => `/msg ${username} Hi ${username}, nice to see you!`,
            (username: string) => `/msg ${username} Hello ${username}, how's it going?`,
            (username: string) => `/msg ${username} Hey ${username}, hope you're having a great day!`
        ];

        // Pick one random message
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];

        // Send it
        Bot.bot.chat(randomMessage(username));

        setTimeout(() => {
            seenPlayerList.delete(uuid)
        }, 500000)
    }
}