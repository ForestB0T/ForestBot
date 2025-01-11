import type Bot      from '../../structure/mineflayer/Bot.js';
import { BotEvents } from 'mineflayer';
import { api, Logger }    from '../../index.js';

export default {
    name: 'end',
    once: true,
    run: async (args: any[], Bot: Bot) => {        
        const content: BotEvents = args[0];
        Bot.isConnected = false;
        
        // lets send a leave packet to our websocket server to let it know the bot has left the server.
        // when it is the bot that left the server, we will also save user sessions to the database.
        
        Bot.bot.quit();
        Bot.endAndRestart();
        Logger.warn("Bot has ended attempting to restart soon.");


        await api.websocket.sendPlayerLeave({
            username: Bot.bot.username,
            uuid: Bot.bot.player.uuid,
            server: Bot.mc_server,
            timestamp: `${Date.now()}`
        });


        return;
    }
};