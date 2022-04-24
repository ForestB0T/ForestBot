import type Bot   from "../../structure/mineflayer/Bot.js"

export default { 
    name: "spawn",
    once: true,
    run: (Bot: Bot) => {
        Bot.restartCount = 0;
        Bot.isConnected = true;
        return
    }
}