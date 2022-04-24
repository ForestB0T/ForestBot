import type { BotEvents } from "mineflayer";
import type Bot           from "../../structure/mineflayer/Bot.js";
import { client }         from "../../index.js";

export default {
    name: 'chat:pveMessages',
    once: false,
    run: (content: BotEvents, Bot: Bot) => {
        const contentArray: string[] = content.toString().split(" ");
        const victim:       string = contentArray[0];

        client.chatEmbed(`> ${content.toString()}`, "purple");

        Bot.endpoints.savePveKill(
            victim,
            content.toString(),
            Bot.mc_server
        )
        
        return;
    }
}