import type Client from "../../structure/discord/client";
import type { Message } from "discord.js";
import { bot, logger } from "../../index.js";
import { reloadConfig } from "../../config.js";

/**
 * Users who spam
 * key: userid, value: spam count
 */
const spam: Map<string, number> = new Map();
const whisperCommands = ["/w", "/whisper", "/msg"]

export default {
    name: "messageCreate",
    once: false,
    execute: async (message: Message, client: Client) => {

        let { author, channel, content, member } = message;
        content = content.replace(/§/g, "$");

        if (author.id === client.user.id) return;
        if (!client.chatChannels.has(channel.id)) return;
        if (client.blacklist.has(author.id)) return;

        const username = `${author.username}#${author.discriminator}`;

        const args = content.split(" ");


        if (client.whitelist.has(author.id)) {
            if (content.startsWith("!restart")) {
                logger.log("Restarting bot...", "blue", true);
                bot.allowConnection = true
                if (bot.isConnected) bot.bot.end();
                else bot.endAndRestart()
                return;
            }
            if (content.startsWith("!stop")) {
                logger.log("Stopping bot...", "blue", true);
                bot.allowConnection = false;
                if (bot.isConnected) bot.bot.end();
                return;
            }
            if (content.startsWith("!say")) {
                args.shift();
                const msg = args.join(" ");
                bot.bot.chat(msg)
                return;
            }
            if (content.startsWith("!whitelist")) {
                args.shift();
                const action = args[0] as "add" | "remove";
                const user = args[1];
                await bot.updateLists(user, action, "whitelist");
                return;
            }
            if (content.startsWith("!blacklist")) {
                args.shift();
                const action = args[0] as "add" | "remove";
                const user = args[1];
                await bot.updateLists(user, action, "blacklist");
                return;
            }
            if (content.startsWith("!reloadconfig")) {
                await reloadConfig(); 
                return;
            }
        }

        if (!client.allow_chatbridge_input) return;
        if (!bot.isConnected) return;

        if (whisperCommands.some(alias => content.startsWith(`${alias}`))) {
            args.shift();

            if (!args[0]) {
                await message.reply("> You need to specify a user to whisper");
                return;
            }

            if (!args[1]) {
                await message.reply("> You need to specify a message to send");
                return;
            }

            const user = args[0];
            args.shift();
            const msg = args.join(" ");
            bot.bot.whisper(user, `${username}: ${msg}`)
            return;
        }

        if (!spam.has(author.id)) {
            spam.set(author.id, 1);
        } else {
            spam.set(author.id, spam.get(author.id) + 1);
        }

        const spamUser = spam.get(author.id);

        if (content.includes("\n") || content.length > 200) return;

        if (spamUser >= 6) {
            client.blacklist.add(author.id);
            await member.send("> You have been blacklisted for spamming")
            return;
        }

        if (spamUser === 1) {
            bot.bot.chat(`${username}: ${content}`);
            setTimeout(() => spam.delete(author.id), 5000);
        } else if (spamUser === 2) {
            await member.send("> Messages can only be sent once every **10 seconds**, consider using the `/whisper` command if you're trying to contact someone.")
                .catch(() => { })
            return;
        }

    }
}