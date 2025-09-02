import type { ForestBotAPI } from "forestbot-api-wrapper-v2";
import { config } from '../config.js';
import time from "../functions/utils/time.js";
import type Bot from "../structure/mineflayer/Bot.js";

export default {
    commands: ['twerk', 'bootyshake', 'booty', 'dance'],
    description: `🤖 I will twerk for 10 seconds on your command Usage: ${config.prefix}twerk`,
    minArgs: 0,
    maxArgs: 1,
    execute: async (user, args, bot: Bot, api: ForestBotAPI) => {
        const endTime = Date.now() + 10000;
        let sneakState = false;
        const interval = setInterval(() => {
            sneakState = !sneakState;
            bot.bot.setControlState('sneak', sneakState);
            if (Date.now() >= endTime) {
                clearInterval(interval);
                bot.bot.setControlState('sneak', false);
            }
        }, 100);
    }
} as MCommand