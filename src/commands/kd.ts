import type { ForestBotAPI} from 'forestbot-api-wrapper-v2';
import { config } from '../config.js';
import Bot from '../structure/mineflayer/Bot.js';

export default {
    commands: ['kd', 'kills', 'deaths'],
    description: `Displays the kill/death ratio of a user. Usage: ${config.prefix}kd <username>`,
    minArgs: 0,
    maxArgs: 1,
    execute: async (user, args, bot: Bot, api: ForestBotAPI) => {
        const search = args[0] ? args[0] : user;

        const uuid = await api.convertUsernameToUuid(search)
        const data = await api.getKd(uuid, config.mc_server);
        if (!data) {
            if (search === user) {
                bot.Whisper(user, `You have no kills or deaths, or unexpected error occurred.`);
            } else {
                bot.Whisper(user, `${search} has no kills or deaths, or unexpected error occurred.`);
            }
            return;
        }

        const kdRatio = data.kills / data.deaths;
        return bot.bot.chat(`${search}: Kills: ${data.kills} Deaths: ${data.deaths} KD: ${kdRatio.toFixed(2)}`);
    }
} as MCommand