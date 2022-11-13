import { BotEvents } from 'mineflayer';
import type Bot      from '../../structure/mineflayer/Bot.js';
import { client }    from "../../index.js";

export default {
    name: 'chat:whisperFrom',
    once: false,
    run: async (args: any[], Bot:Bot) => {
        const content: BotEvents = args[0];
        const user     = content[0][0];
        const message  = content[0][1];
        
        client.chatEmbed(`From: ${user} - ${message}`, "pink");

        return;
    }
};