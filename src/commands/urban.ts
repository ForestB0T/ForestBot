import type Bot from '../structure/mineflayer/Bot.js';
import ud       from 'urban-dictionary';

export default {
    commands: ['urban'],
    minArgs: 0,
    maxArgs: 1,
    execute: async (user: string, args: any[], bot: Bot) => {
        return ud.define(`${args.join(" ")}`, (error:unknown, results:any[]) => {
            if (error) return bot.bot.whisper(user, "No results found.");
            
            let def:string = results[0].definition;
            let maxL: number = 140;
            
            const trimmedString = def.length > maxL 
            ? def = def.substring(0, maxL - 3) + "..." 
            : def;
            
            const lineBreaks = /\n/g;
            if (trimmedString.match(lineBreaks)) {
                def = trimmedString.split(lineBreaks).join(" ");
                def = def.split(" ")[0]
            }

            bot.bot.chat(def);
        });
    }
 }