import { bot, websocket } from "../../index.js";
import { config } from "../../config.js";
import type Bot from "../../structure/mineflayer/Bot.js";
import mcCommandHandler from "../../structure/mineflayer/commandHandler.js";
import parseUsername from "../../structure/mineflayer/utils/parseUsername.js";
import chalk from "chalk";
/**
 * This event is basically only used to capture kill messages.
 */
const dividers = ["[w]", "»", "From", "To", ">", ":", "left", "Left", "joined", "whispers", "[EUPVP]", "[Duels]", "voted", "has requested to teleport to you."];

export default {
    name: "messagestr",
    once: false,
    run: async (args: any[], Bot: Bot) => {
        const message = args[0] as string;
        const words = message.split(" ");

        try {
            if (
                message.includes("has reached the goal") ||
                message.includes("has made the advancement") ||
                message.includes("has completed the challenge")
            ) {
                const userToSave = Bot.bot.players[words[1]] ? words[1] : words[0];
                websocket.send({
                    type: "minecraft",
                    action: "saveadvancement",
                    data: {
                        username: userToSave,
                        advancement: message,
                        mc_server: Bot.mc_server,
                        time: Date.now()
                    }
                });

                console.log(chalk.yellow(`${message}`));

                return;
            }

            if (config.useRawChat && args[1] === "chat") {
                let username = (Object.values(Bot.bot.players).find(val => val.uuid === args[3])).username;
                username = parseUsername(username, Bot.bot);

                console.log(chalk.red(`${username}`), chalk.white(`: ${message}`));

                websocket.send({
                    type: "minecraft",
                    action: "savechat",
                    data: {
                        name: username,
                        message: message,
                        mc_server: Bot.mc_server
                    },
                    mcServer: Bot.mc_server
                })

                if (username === Bot.bot.username) return;
                await mcCommandHandler(username, message, Bot);
                return;
            }


            if (dividers.some((divider) => message.includes(divider))) return;


            const saveKill = async (victim: string) => {
                const victimIndex = words.indexOf(victim);
                let murderer = null;
                for (let i = victimIndex + 1; i < words.length; i++) {
                    if (Bot.bot.players[words[i]]) {
                        if (Bot.bot.players[words[i + 1]]) {
                            murderer = words[i + 1]
                            break;
                        }
                        murderer = words[i];
                        break;
                    }
                }

                console.log(chalk.red(`${message}`));


                websocket.send({
                    type: "minecraft",
                    action: "savedeath",
                    data: {
                        victim,
                        death_message: message,
                        murderer: murderer ? murderer : null,
                        time: Date.now(),
                        type: murderer ? "pvp" : "pve",
                        mc_server: bot.mc_server
                    },
                    mcServer: Bot.mc_server
                })


            }

            if (Bot.bot.players[words[0]] && !Bot.bot.players[words[1]]) {
                saveKill(words[0])
                return;
            }
            else if (Bot.bot.players[words[1]]) {
                saveKill(words[1])
                return;
            }
            return;

        } catch (err) { return console.log(err) }
    }
}