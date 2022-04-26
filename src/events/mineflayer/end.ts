import type Bot      from '../../structure/mineflayer/Bot.js';
import { BotEvents } from 'mineflayer';
import { logger }    from '../../index.js';

export default {
    name: 'end',
    once: false,
    run: (content: BotEvents, Bot: Bot) => {
        Bot.isConnected = false;
        Bot.endAndRestart()
        logger.log("> Bot has ended", "red", true);
        return;
    }
};