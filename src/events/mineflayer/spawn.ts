import type Bot   from "../../structure/mineflayer/Bot.js"

export default { 
    name: "spawn",
    once: true,
    run: async (args: any[], Bot: Bot) => {
        Bot.restartCount = 0;
        Bot.isConnected = true;

        const pos = Bot.bot.entity.position;
        await Bot.bot.look(pos.x + Math.PI, 0, true);

        return
    }
}