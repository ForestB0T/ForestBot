import type { ForestBotAPI } from 'forestbot-api-wrapper-v2';
import { config } from '../config.js';

export default {
    commands: ['iam'],
    description: `Use ${config.prefix}iam to set your ${config.prefix}whois description.`,
    minArgs: 0,
    maxArgs: 255,
    execute: async (user, args, bot, api: ForestBotAPI) => {
       
        //dont let users put "/" . leads to command injections ingame
       
        if (!args || args.length === 0) return bot.bot.whisper(user, "View descriptions with !whois or set one with !iam");
        try {
            await api.postWhoIsDescription(user, args.join(" "));
            bot.Whisper(user, `your !whois has been set.`);
            return
        } catch {
            return;
        }
    }
} as MCommand