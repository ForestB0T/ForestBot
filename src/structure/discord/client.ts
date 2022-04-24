import { Client as client, ColorResolvable, TextChannel } from 'discord.js';
import type Options              from "../../config"
import logger                    from '../../functions/utils/logger.js';
import { bot, colors } from '../../index.js';

/**
 * @class Client
 * Main class for discord bot.
 */
export default class Client extends client {

    public chatChannels: Map<string, TextChannel> = new Map();

    constructor(options: Options["discord"]) {
        super(options);
        this.token = options.token;
        this.login();
        this.once("ready", this.Ready);
    }

    /**
     * This function is called when the
     * discord bot is ready to use.
     */
    private Ready() {
        logger.log("Discord bot is ready.", "green");
        this.loadChannels(bot.mc_server);
        setInterval(() => { this.loadChannels(bot.mc_server) }, 2 * 60000)
    }

    /**
     * 
     * Load all the chat channels for a specific minecraft server,
     * and get a TextChannel from discord's cache by channel Id.
     * @param mc_server 
     */
    async loadChannels(mc_server: string) { 
        const channelIdArry = [];
        const channels = (await bot.endpoints.getChannels(mc_server)).channels;
        if (!channels) return;
        for (const Channel of channels) {
            channelIdArry.push(Channel)
            const channel = this.channels.cache.get(Channel) as TextChannel;
            this.chatChannels.set(Channel, channel);
        }

        for (const [key, _] of this.chatChannels) {
            if(!channelIdArry.includes(key)) {
                this.chatChannels.delete(key);
            }
        }

    }

    /**
     * 
     * Send messages to discord chat channels,
     * these messages will be sent to all discord channels
     * in the chatChannels array
     * 
     * @param text 
     * @param color 
     */
    public chatEmbed = async (text: string, color: string) => {
        for (const [_, channel] of this.chatChannels) {
            if (!channel) return;
            await channel.send({
                embeds: [{
                    color: colors[color] as ColorResolvable,
                    description: text
                }]
            }).catch(() => { });
        }
    }

}