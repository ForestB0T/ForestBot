import type Bot      from '../../structure/mineflayer/Bot.js';
import { BotEvents } from 'mineflayer';

export default {
    name: 'end',
    once: false,
    run: (content: BotEvents, Bot: Bot) => {
        Bot.isConnected = false;
        Bot.endAndRestart()
        console.log("End event ran")
        return;
    }
};