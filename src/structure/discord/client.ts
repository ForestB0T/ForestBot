import { Client as client, ColorResolvable, TextChannel } from 'discord.js';
import type Options              from "../../config"
import { bot, colors, config }   from '../../index.js';
import { readFile, readdir }     from 'fs/promises';

/**
 * @class Client
 * Main class for discord bot.
 */
export default class Client extends client {

    public allow_chatbridge_input : boolean;
    public chatChannels           : Map<string, TextChannel> = new Map();
    public whitelist              : Set<string> = new Set();
    public blacklist              : Set<string> = new Set();

    constructor(options: Options["discord"]) {
        super(options);
        config.discord_whitelist.forEach(user => this.whitelist.add(user));
        config.discord_blacklist.forEach(user => this.blacklist.add(user));
        this.allow_chatbridge_input = config.allow_chatbridge_input;
        this.token = options.token;
        this.login();
        this.handleEvents();
    }

    private async handleEvents() {
        for (const file of (await readdir('./build/events/discord')).filter(file => file.endsWith(".js"))) {
            const event = (await import(`../../events/discord/${file}`)).default;

            event.once
                ? this.once(event.name, (...args) => event.execute(...args, this))
                : this.on(event.name, (...args) => event.execute(...args, this))
        };
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