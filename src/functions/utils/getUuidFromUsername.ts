
/**
 * 
 * Function to get the UUID from a username
 * 
 */

import Bot from "../../structure/mineflayer/Bot";

export default function getUuidFromUsername(username: string, bot: Bot): Promise<string | null> {
    return new Promise((resolve, reject) => {
        for (const player of Object.values(bot.bot.players)) {
            if (username === player.username) {
                resolve(player.uuid);
            }
        }
        resolve(null);
    });
}