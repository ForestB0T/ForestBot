import type Bot   from "../../structure/mineflayer/Bot.js"
import time       from "../../functions/utils/time.js";
export default { 
    name: "spawn",
    once: true,
    run: async (args: any[], Bot: Bot) => {
        Bot.restartCount = 0;
        Bot.isConnected = true;

        await time.sleep(2000);

        const pos = Bot.bot.entity.position;
        await Bot.bot.look(180, 0, true);

        return
    }
}