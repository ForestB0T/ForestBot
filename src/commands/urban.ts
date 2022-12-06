import type Bot from '../structure/mineflayer/Bot.js';
import ud       from 'urban-dictionary';


const disallowedDefs = ["mule"]

export default {
    commands: ['urban'],
    minArgs: 0,
    maxArgs: 1,
    execute: async (user: string, args: any[], bot: Bot) => {

        if(disallowedDefs.some(def => args.join(" ").toLowerCase().includes(def))) 
            return bot.bot.whisper(user, "This definition breaks the bot so therefore is not allowed because febzey is too lazy to create a real fix")

        return ud.define(`${args.join(" ")}`, (error:unknown, results:any[]) => {
            if (error) return bot.bot.whisper(user, "No results found.");
            
            let def:string = results[0].definition;
            let maxL: number = 130;
            
            const trimmedString = def.length > maxL 
            ? def = def.substring(0, maxL - 3) + "..." 
            : def;
            
            const lineBreaks = /\n/g;
            if (trimmedString.match(lineBreaks)) {
                def = trimmedString.split(lineBreaks).join(" ");
                def = def.split(" ")[0]
            }

            //check for weird S
            if (trimmedString.includes("§")) { 
                trimmedString.replace("§", "");
            }

            bot.bot.chat(def);
        });
    }
 } as MCommand