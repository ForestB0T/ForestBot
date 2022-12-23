import type Forestbot from "../../structure/mineflayer/Bot";

const seenPlayerList = new Set<string>();

const greetings = [
    "Hello, $username!",
    "Welcome, $username!",
    "Hi, $username!",
    "Greetings, $username!",
    "Good to see you, $username!",
    "How's it going, $username?",
    "Nice to meet you, $username!",
    "Glad to see you, $username!",
    "Good morning/afternoon/evening, $username!",
    "How are you doing, $username?",
    "It's great to see you, $username!"
];

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

        const greeting = greetings[Math.floor(Math.random() * greetings.length)];
        Bot.bot.chat(greeting.replace("$username", username));

        setTimeout(() => {
            seenPlayerList.delete(uuid)
        }, 30000)
    }
}