import type { ForestBotApiClient } from 'forestbot-api';
import Bot from '../structure/mineflayer/Bot';
import { config } from '../config.js';

function generateRandomHash() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 5; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
  

export default {
    commands: ['tab', 'tablist'],
    minArgs: 0,
    maxArgs: 255,
    execute: async (user, args, bot: Bot, api: ForestBotApiClient) => {

        bot.bot.chat(`${config.api_url}/tab/${config.mc_server}?${generateRandomHash()}`)

    }
} as MCommand