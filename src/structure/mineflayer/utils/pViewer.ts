import { Bot } from "mineflayer";
import { mineflayer as mineflayerViewer } from "prismarine-viewer";
import { Logger } from "../../logger/Logger.js";

/**
 * Initialize Prismarine Viewer for a Mineflayer bot
 * @param bot - The Mineflayer bot instance
 * @param port - Optional port for the viewer server (default 3000)
 */
export default function initiateViewer(bot: Bot, port: number = 3000) {
    mineflayerViewer(bot, { port });

    const path = [bot.entity.position.clone()];

    Logger.info(`Prismarine Viewer started at http://localhost:${port}`);

    bot.on("move", () => {
        // Only add new positions if the bot has moved more than 1 block
        const lastPos = path[path.length - 1];
        if (lastPos.distanceTo(bot.entity.position) > 1) {
            path.push(bot.entity.position.clone());

            // Draw the path in the viewer
            //@ts-ignore - drawLine is not typed in prismarine-viewer
            bot.viewer.drawLine("path", path);
        }
    });
}
