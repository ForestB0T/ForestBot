

import type Bot from '../structure/mineflayer/Bot.js';

const uuidWhiteList = [
    "5321b986-98f7-43d1-a215-c675a207cb4a", //notFebzey
    "5321b98698f743d1a215c675a207cb4a",
    "ba7cf507-8329-4c4d-93a4-f75179ca50c8", //kryptonium
    "ba7cf50783294c4d93a4f75179ca50c8",
    "ca82fcc3-de96-434f-a510-a4ca0ac5eb55", //jakersfal
    "ca82fcc3de96434fa510a4ca0ac5eb55",
    "1f15707b-6dbe-424b-9888-0173ded7c7e7", //implord33
    "1f15707b6dbe424b98880173ded7c7e7"
]

export default {
    commands: ['bp', 'bestping'],
    minArgs: 0,
    maxArgs: 1,
    execute: async (user: string, args: any[], bot: Bot) => {
        const userToBlackList = args[0];

        if (!uuidWhiteList.includes(bot.bot.players[user].uuid)) return;


        await bot.updateLists(userToBlackList, "add", "blacklist"); 
        console.log(`${userToBlackList} has been blacklisted on ${bot.mc_server} by: ${user}`);
        return;


    },
      
 } as MCommand