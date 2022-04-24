import type { BotEvents }   from "mineflayer";
import type Bot             from "../../structure/mineflayer/Bot.js";
import { client }           from "../../index.js";

export default {
    name: 'chat:pvpMessages',
    once: false,
    run: (content: BotEvents, Bot: Bot) => {
        const contentArray: string[] = content.toString().split(" ");
        const victim:       string = contentArray[0];
        let murderer:       string = contentArray[contentArray.length - 1];

        if (contentArray[5] === 'using') murderer = contentArray[4];

        client.chatEmbed(`> ${content.toString()}`, "purple")

        Bot.endpoints.savePvpKill(
            victim,
            murderer,
            content.toString(),
            Bot.mc_server
        )

        return;
    }
}