
import type Bot      from '../../structure/mineflayer/Bot.js';
import { BotEvents } from 'mineflayer';
import { api, Logger }    from '../../index.js';

export default {
    name: 'physicsTick',
    once: false,
    run: async (args: any[], Bot: Bot) => {        
        const content: BotEvents = args[0];
        const closestEntity = Bot.bot.nearestEntity();
        if (closestEntity) {
          Bot.bot.lookAt(closestEntity.position.offset(0, 1, 0)); // Offset to look at the player's head
        }
    }
};