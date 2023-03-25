import type Bot   from "../../structure/mineflayer/Bot.js"
import time       from "../../functions/utils/time.js";
import { config } from "../../config.js";
import antiafk    from "../../functions/utils/antiAFK.js";
export default { 
    name: "spawn",
    once: true,
    run: async (args: any[], Bot: Bot) => {
        Bot.restartCount = 0;
        Bot.isConnected = true;
        if (config.rotateHeadOnJoin) {
            await time.sleep(2000);
            await Bot.bot.look(180, 0, true);
        }

        if (config.antiafk) {
            antiafk(Bot.bot);
        }

        return
    }
}