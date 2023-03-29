import type { BotEvents } from 'mineflayer';
import { client } from "../../index.js";
import { config } from "../../config.js";
import Bot from '../../structure/mineflayer/Bot.js';
import mcCommandHandler from '../../structure/mineflayer/commandHandler.js';
import parseUsername from '../../structure/mineflayer/utils/parseUsername.js';
const prefix = config.prefix;

export default {
    name: "chat:chat",
    once: false,
    run: async (args: any[], Bot: Bot) => {
        const content: BotEvents = args[0];
        if (config.useRawChat) return;

        try {

            const user = {
                username: parseUsername(content[0][0], Bot.bot),
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

            (Bot.apiWebSockets.get("savechat")).send(
                {
                    username: user.username,
                    message: user.message,
                    mc_server: Bot.mc_server
                }
            )

            client.chatEmbed(`**${user.username}** » ${user.message}`, "gray");

            if (!user.message.startsWith(prefix)) return;
            if (user.username === Bot.bot.username) return;
            await mcCommandHandler(user.username, user.message, Bot);

        } catch (err) {
            return console.log(err.message);
        }
    }
}

