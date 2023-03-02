import type Bot from "./Bot";
import { config } from "../../config.js";

const spam: Map<string, number> = new Map();
function antiSpamHandler(args: antiSpamArgsType) {
    const { user, Bot, cooldown_time, spam_limit } = args;
    if (!spam.has(user)) spam.set(user, 1);
    else spam.set(user, spam.get(user) + 1);

    const sUser = spam.get(user);
    if (sUser === 2) {
        return false;
    }

    if (sUser >= spam_limit) {
        Bot.updateLists(user, "add", "blacklist");
        return false;
    }

    if (sUser === 1) {
        setTimeout(() => spam.delete(user), cooldown_time);
    }

    return sUser <= 1 ? true : false;
}


export default async function mcCommandHandler(user: string, message: string, bot: Bot) {
    for (const [key, value] of bot.commands) {
        for (const alias of value.commands) {
            if (message.toLocaleLowerCase().startsWith(`${config.prefix}${alias}`)) {

                if (Object.keys(config.commands).some(k=>k===key) && !config.commands[key]) return;
                let args = message.split(" ");
                args.shift();

                if (antiSpamHandler({
                    user,
                    Bot: bot,
                    cooldown_time: config.anti_spam_cooldown,
                    spam_limit: config.anti_spam_msg_limit
                })) {
                    value.execute(user, args, bot);
                }
                
            }
        }
    }
};