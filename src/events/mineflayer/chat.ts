import type { BotEvents } from 'mineflayer';
import { client } from "../../index.js";
import { config } from "../../config.js";
import Bot from '../../structure/mineflayer/Bot.js';

const prefix = config.prefix;
const spam: Map<string, number> = new Map();

function antiSpamHandler(args: antiSpamArgsType): boolean {
    const { user, Bot, cooldown_time, spam_limit } = args;

    if (!spam.has(user)) spam.set(user, 1);
    else spam.set(user, spam.get(user) + 1);

    const sUser = spam.get(user);

    if (sUser === 2) {
        return false;
    }

    if (sUser >= spam_limit) {
        Bot.updateLists(user, "add", "blacklist");
        return false
    }

    if (sUser === 1) {
        setTimeout(() => spam.delete(user), cooldown_time)
    }

    return sUser <= 1 ? true : false;

}

export default {
    name: "chat:chat",
    once: false,
    run: async (args: any[], Bot: Bot) => {
        const content: BotEvents = args[0];
        console.log(args, " chat:chat");
        try {

            const user = {
                username: content[0][0],
                message: content[0][1]
            }

            if (Bot.userBlacklist.has(user.username)) return;

            if (
                user.message.endsWith("[w]") ||
                user.username === "From:" ||
                user.username === "To:" ||
                user.message.split(" ")[1] === "»"
            ) {
                return;
            }

            await Bot.endpoints.saveChat(
                user.username,
                user.message,
                Bot.mc_server
            )

            client.chatEmbed(`**${user.username}** » ${user.message}`, "gray");

            if (!user.message.startsWith(prefix)) return;
            if (user.username === Bot.bot.username) return;

            for (const [key, value] of Bot.commands) {
                for (const alias of value.commands) {
                    if (user.message.toLowerCase().startsWith(`${prefix}${alias}`)) {
                        
                        /**
                         * Checking for disabled commands.
                         */
                        if (Object.keys(config.commands).some(k=>k===key) && !config.commands[key]) return
                        let args = user.message.split(" ")
                        args.shift();

                        if (antiSpamHandler({
                            user: user.username,
                            Bot: Bot,
                            cooldown_time: config.anti_spam_cooldown,
                            spam_limit: config.anti_spam_msg_limit
                        })) {
                            value.execute(user.username, args, Bot);
                        }

                        return;
                    }
                }
            }

        } catch (err) {
            return console.log(err.message);
        }
    }
}