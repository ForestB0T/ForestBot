import time from '../functions/utils/time.js';
import type { ForestBotApiClient } from 'forestbot-api';
import { config } from '../config.js';


interface Advancements {
    advancements: [{
        username: string,
        advancement: string,
        time: number,
        mc_server: string,
        id: number,
        uuid: string
    }]
}

export default {
    commands: ['lastadvancement', 'la', 'advancement'],
    description: `Use ${config.prefix}lastadvancement to get the last advancement of a player.`,
    minArgs: 0,
    maxArgs: 1,
    execute: async (user, args, bot, api: ForestBotApiClient) => {
        const search = args[0] ? args[0] : user;

        // const data = await api.

        const url = `http://192.168.100.132:8000/advancements/${search}/${config.mc_server}/1/last`

        const data = await (await fetch(url)).json() as Advancements;

        const timeStampAgo = time.timeAgoStr(parseInt(data.advancements[0].time.toString()));
        
        const advancement = data.advancements[0].advancement;

        
        bot.bot.chat(`${advancement}, ${timeStampAgo}`);

        return;
    }
} as MCommand