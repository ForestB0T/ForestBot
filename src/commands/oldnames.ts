import type { ForestBotAPI } from "forestbot-api-wrapper-v2";
import { config } from '../config.js';
import Bot from "../structure/mineflayer/Bot.js";

export default {
    commands: ['oldnames'],
    description: `See a users name history! Usage: ${config.prefix}oldnames <username>`,
    minArgs: 0,
    maxArgs: 1,
    execute: async (user, args, bot: Bot, api: ForestBotAPI) => {

        const userToSearch = args[0] || user;
        const uuid = await api.convertUsernameToUuid(userToSearch);
        if (!uuid) return bot.Whisper(user, `Could not find the users UUID you where looking for. It might not be in my database.`);

        const apiUrl = `https://laby.net/api/v3/user/${uuid}/profile`
        const response = await fetch(apiUrl);
        if (!response.ok) return bot.bot.chat(`An error occured while trying to fetch the users name history.`);
        const data = await response.json();
        
        const nameHistory = data.name_history.map(entry => entry.name);
        const inappropriateName = "1HateN1ggers";
        const index = nameHistory.indexOf(inappropriateName);
        if (index !== -1) nameHistory.splice(index, 1);
    

        return bot.bot.chat(`${userToSearch} has used the following names: ${nameHistory.join(", ")}`);
    }
} as MCommand