import type { BotEvents } from 'mineflayer';
import type Bot      from '../../structure/mineflayer/Bot.js';

export default {
    name: 'soundEffectHeard',
    once: false,
    run: async (args: any[], Bot:Bot) => {
        const [a,b,c,d] = args as Parameters<BotEvents["soundEffectHeard"]>;
        
        // console.log(`Sound name: ${a}, position: ${b}, volume: ${c}, pitch: ${d}`);
        //     return;
    }
};