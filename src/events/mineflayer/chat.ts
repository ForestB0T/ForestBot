import type { BotEvents } from 'mineflayer';
import { config, client } from "../../index.js";
import Bot from '../../structure/mineflayer/Bot.js';

const prefix = config.prefix;
const spam: Map<string, number> = new Map();

function antiSpamHandler(args: antiSpamArgsType): boolean {
    const { user, Bot, cooldown_time, spam_limit } = args;

    if (!spam.has(user)) spam.set(user, 1);
    else spam.set(user, spam.get(user) + 1);

    const sUser = spam.get(user);

    if (sUser === 2) {
        Bot.bot.whisper(user, `[Anti-Spam] - Please wait ${cooldown_time / 1000} seconds.`);
        return false;
    }

    if (sUser >= spam_limit) {
        Bot.bot.whisper(user, "[Anti-Spam] - You have been blacklisted for spamming commands.");
        Bot.userBlacklist.add(user);
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

        try {

            const user = {
                username: content[0][0],
                message: content[0][1]
            }

            if (
                user.message.endsWith("[w]") ||
                user.username === "From:" ||
                user.username === "To:" ||
                user.message.split(" ")[1] === "»"
            ) {
                return;
            }

            Bot.endpoints.saveChat(
                user.username,
                user.message,
                Bot.mc_server
            )

            client.chatEmbed(`**${user.username}** » ${user.message}`, "gray");

            if (!user.message.startsWith(prefix)) return;
            for (const [key, value] of Bot.commands) {
                for (const alias of value.commands) {
                    if (user.message.toLowerCase().startsWith(`${prefix}${alias}`)) {
                        if (Bot.userBlacklist.has(user.username)) return;
                        if (user.username === Bot.bot.username) return;

                        if (Bot.disabledCommands.has(key) || (Bot.useWhitelist && (Bot.whitelistedCmds.has(alias) && !Bot.userWhitelist.has(user.username)))) return;
                        if (!Bot.useCommands) return;

                        let args = user.message.split(" ")
                        args.shift();

                        if (antiSpamHandler({
                            user: user.username,
                            Bot: Bot,
                            cooldown_time: config.anti_spam_cooldown,
                            spam_limit: config.anti_spam_msg_limit
                        })) value.execute(user.username, args, Bot);

                        return;
                    }
                }
            }

        } catch (err) {
            return console.log(err.message);
        }
    }
}