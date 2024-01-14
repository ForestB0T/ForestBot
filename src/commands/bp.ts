import { ForestBotApiClient } from 'forestbot-api';
import type Bot from '../structure/mineflayer/Bot.js';

export default {
    commands: ['bp', 'bestping'],
    description: "Use !bp to get the user with best ping.",
    minArgs: 0,
    maxArgs: 1,
    execute: async (user, args, bot, api: ForestBotApiClient) => {
      const players:any = bot.bot.players;
        let playerWithBestPing:any = null;
      
        // Find the player with the best ping (excluding players with ping 0)
        for (const player in players) {
          const ping = players[player].ping;
          if (ping > 0 && (!playerWithBestPing || ping < playerWithBestPing.ping)) {
            playerWithBestPing = { name: player, ping };
          }
        }
      
        // If no player with non-zero ping is found, then just use the player with 0 ping
        if (!playerWithBestPing) {
          playerWithBestPing = { name: Object.keys(players)[0], ping: 0 };
        }
      
        const { name, ping } = playerWithBestPing;
        let str = `${name}: ${ping}ms`;
        if (ping === 0) {
          str = `${name}: ${ping}ms (Most likely just joined.)`;
        }
      
        return bot.bot.chat(`Best ping: ${str}`);
      }
      
 } as MCommand