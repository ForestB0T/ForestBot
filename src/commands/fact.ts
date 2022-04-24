import type Bot from '../structure/mineflayer/Bot.js';

export default {
    commands: ['fact'],
    minArgs: 0,
    maxArgs: 40,
    execute: async (user: string, args: any[], bot: Bot) => {

        if (!args[0]) {
            const data = await bot.endpoints.getRandomFact();
            if (!data) {
                bot.bot.whisper(user, "Sorry, something went wrong.");
                return;
            }   

            bot.bot.whisper(user, data.fact);
            return;
        }

        if (args[0].match(/^\d+$/) || (args[0] === "id" && args[1].match(/^\d+$/)))  { 
            let factId = args[0];    
            if (args[0] === "id") factId = args[1];
            const data = await bot.endpoints.getFact(factId);
            if (!data) { 
                bot.bot.whisper(user, "Fact not found or api error.");
                return;
            }

            bot.bot.whisper(user, `Fact: ${data.fact}`);
            return;

        }

        if (args[0] === "add") {
            let fact = args as any;
            fact.shift();
            fact = fact.join(" ");

            if (fact.length > 140) { 
                bot.bot.whisper(user, "Fact is longer than 140 characters.") 
                return
            }

            const dataJson = await bot.endpoints.addFact(
                user,
                fact,
                bot.mc_server
            );

            const data = await dataJson.json();

            if (!data) {
                bot.bot.whisper(user, "Sorry, something went wrong.");
                return
            }

            bot.bot.whisper(user, `Fact added. Id: ${data.id}`);

            return

        }

    }
 }