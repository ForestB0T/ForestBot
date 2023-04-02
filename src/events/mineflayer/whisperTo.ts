import type Bot      from '../../structure/mineflayer/Bot.js';
import { BotEvents } from 'mineflayer';

export default {
    name: 'chat:whisperTo',
    once: false,
    run: async (args: any[], Bot: Bot) => {
        const content: BotEvents = args[0];
        const user     = content[0][0];
        const message  = content[0][1];
        
        return;
    }
};