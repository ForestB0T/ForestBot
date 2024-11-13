//make the getFaq command, lets see what you got copilot!
import type { ForestBotAPI } from 'forestbot-api-wrapper-v2';
import { config } from '../config.js';
import Bot from '../structure/mineflayer/Bot.js';

export default {
    commands: ['faq', 'getfaq'],
    description: `Use ${config.prefix}getfaq to get a FAQ. !getfaq <id>`,
    minArgs: 1,
    maxArgs: 1,
    execute: async (user, args, bot: Bot, api: ForestBotAPI) => {

        const id = args[0];
        
        try {
            const data = await api.getFaq(id, bot.mc_server);
            if (!data) return bot.Whisper(user, `There was an error getting your FAQ, it may not exist.`);
            bot.bot.chat(`Entry #${data.id}: ${data.faq}`);
            return
        } catch {
            return

        }
    }
} as MCommand