import type Client      from "../../structure/discord/client";
import type { Message } from "discord.js";
import { bot }          from "../../index.js";

/**
 * Users who spam
 * key: userid, value: spam count
 */
const spam: Map<string, number> = new Map();

export default { 
    name: "messageCreate",
    once: false,
    execute: async (message: Message, client: Client) => { 
        
        const { author, channel, content } = message;

        if (!client.chatChannels.has(channel.id)) return;
        if (client.blacklist.has(author.id)) return;

        spam.set(author.id, 1);
        const spamUser = spam.get(author.id);

        const username = `${author.username}#${author.discriminator}`;

        if (content.includes("\n") || content.length > 200) return;

        if (spamUser >= 8) {
            client.blacklist.add(author.id);
            return;
        }

        if (client.chatChannels.has(channel.id) && client.allow_chatbridge_input && spamUser === 1) { 
            bot.bot.chat(`${username}: ${content}`);
            setTimeout(() => spam.delete(author.id), 5000);
        }

    }
}