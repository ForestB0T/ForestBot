import type { ForestBotAPI } from "forestbot-api-wrapper-v2";
import { config } from '../config.js';
import type Bot from "../structure/mineflayer/Bot.js";

export default {
    commands: ['drop'],
    description: `I will drop items in my hand, or all of my items. ${config.prefix}drop (all)`,
    minArgs: 0,
    maxArgs: 1,
    execute: async (user, args, bot: Bot, api: ForestBotAPI) => {

        if (args[0] === 'all') {
            const items = bot.bot.inventory.items();
            for (const item of items) {
                await bot.bot.tossStack(item);
            }
        } else {
            const heldItem = bot.bot.heldItem;
            if (heldItem) {
                await bot.bot.tossStack(heldItem);
            }
        }
    }
} as MCommand