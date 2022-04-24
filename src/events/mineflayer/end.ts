import type Bot      from '../../structure/mineflayer/Bot.js';
import { BotEvents } from 'mineflayer';

export default {
    name: 'end',
    once: false,
    run: (content: BotEvents, Bot: Bot) => {
        Bot.endAndRestart()
        return;
    }
};