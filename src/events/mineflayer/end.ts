import type Bot      from '../../structure/mineflayer/Bot.js';
import { BotEvents } from 'mineflayer';
import { Logger }    from '../../index.js';

export default {
    name: 'end',
    once: true,
    run: (args: any[], Bot: Bot) => {        
        const content: BotEvents = args[0];
        Bot.isConnected = false;
        Bot.bot.quit();
        Bot.endAndRestart();
        Logger.warn("Bot has ended attempting to restart soon.");
        return;
    }
};