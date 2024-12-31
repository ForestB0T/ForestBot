import axios from 'axios'; //requires the axios package
import { ForestBotApiClient } from 'forestbot-api';
import type Bot from '../structure/mineflayer/Bot.js';
import { config } from '../config.js';

export default {
    commands: ['joke'],
    description: `Use ${config.prefix}joke to get a random joke message.`,
    minArgs: 0,
    maxArgs: 2,
    execute: async (user, args, bot, api) => {
        try {
            const response = await axios.get('https://v2.jokeapi.dev/joke/Any?blacklistFlags=nsfw,religious,political,racist,sexist,explicit&type=single');

            const joke = response.data.joke;

            if (joke) {
                bot.bot.chat(`Random Joke: ${joke}`);
            } else {
                bot.bot.chat('Sorry, something went wrong. Try again later.');
            }
        } catch (error) {
            console.error('Error fetching joke:', error.message);
            bot.bot.chat('Sorry, something went wrong. Try again later.');
        }
    },
} as MCommand;
