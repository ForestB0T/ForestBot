import type Bot      from '../../structure/mineflayer/Bot.js';
import { BotEvents } from 'mineflayer';
import { logger }    from '../../index.js';

export default {
    name: 'end',
    once: false,
    run: (args: any[], Bot: Bot) => {        
        const content: BotEvents = args[0];
        Bot.isConnected = false;
        Bot.bot.quit();
        Bot.endAndRestart();
        logger.log("> Bot has ended", "red", true);
        return;
    }
};