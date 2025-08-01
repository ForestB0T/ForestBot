import type Bot from "../Bot";
import { config } from "../../../config.js";
import { Logger, api } from "../../../index.js";

export default async function mcCommandHandler(
    user: string,
    message: string,
    bot: Bot,
    uuid: string
): Promise<void> {
    if (!config.useCommands) return;

    const commandPrefix = config.prefix;
    const [command, ...args] = message.trim().split(" ");
    const commandKey = `${command.toLowerCase()} ${args.join(" ").toLowerCase()}`;

    // Find matching command
    const matchedCommand = Array.from(bot.commands.values()).find(cmd =>
        cmd.commands.some(alias => command.toLowerCase() === `${commandPrefix}${alias}`)
    );

    if (!matchedCommand) return; // No valid command found

    // Check if command is disabled
    if (config.commands.hasOwnProperty(command) && !config.commands[command]) {
        return;
    }

    if (matchedCommand.whitelisted && !bot.userWhitelist.has(uuid)) {
        bot.Whisper(user, `Sorry, ${user}, you are not allowed to use this command.`);
        return;
    }

    Logger.command(user, message);
    matchedCommand.execute(user, args, bot, api);
}


// import type Bot from "../Bot";

// interface AntiSpamResult {
//     action: "allow" | "blacklist" | "wait";
//     reason?: string;
// }
// import { config } from "../../../config.js";
// import { Logger, api } from "../../../index.js";


// /**
//  * Anti spam handler very shit
//  */
// interface UserCommandData {
//     lastCommands: { commandKey: string, time: number }[];
//     lastCommandTime: number;
//     commandCount: number;
// }

// const userCommandTracker: Map<string, UserCommandData> = new Map();
// function antiSpamHandler(
//     uuid: string,
//     commandKey: string
// ): AntiSpamResult {

//     const cooldownTime = config.anti_spam_cooldown; // 5 seconds
//     const spamLimit = config.anti_spam_msg_limit;   // 5 commands within cooldown time
//     const blacklistTime = 1 * 60 * 1000;            // 1 minute (adjusted in logic below)

//     // Initialize user data if not present
//     if (!userCommandTracker.has(uuid)) {
//         userCommandTracker.set(uuid, {
//             lastCommands: [],
//             lastCommandTime: 0,
//             commandCount: 0
//         });
//     }

//     const userData = userCommandTracker.get(uuid)!;
//     const currentTime = Date.now();

//     // Cooldown check
//     if (currentTime - userData.lastCommandTime < cooldownTime) {
//         userData.commandCount++;

//         if (userData.commandCount >= spamLimit) {
//             // Too many rapid commands — require wait instead of blacklist
//             return {
//                 action: "wait",
//                 reason: "Too many rapid commands, please slow down"
//             };
//         }

//         return {
//             action: "wait",
//             reason: "Command sent too quickly"
//         };
//     }

//     // Cooldown passed, reset command count
//     userData.commandCount = 1;
//     userData.lastCommandTime = currentTime;

//     // Add command to history
//     userData.lastCommands.push({ commandKey, time: currentTime });
//     if (userData.lastCommands.length > 5) {
//         userData.lastCommands.shift();
//     }

//     // Softer repeat-command spam logic
//     const repeated = userData.lastCommands.length === 5 &&
//         userData.lastCommands.every(cmd =>
//             cmd.commandKey === commandKey &&
//             currentTime - cmd.time <= 15 * 1000 // 15-second repeat window
//         );

//     if (repeated) {
//         return {
//             action: "wait",
//             reason: "You're repeating the same command too quickly"
//         };
//     }

//     return { action: "allow" };
// }

// export default async function mcCommandHandler(
//     user: string,
//     message: string,
//     bot: Bot,
//     uuid: string
// ): Promise<void> {
//     if (!config.useCommands) return;
    
//     const commandPrefix = config.prefix;
//     const [command, ...args] = message.trim().split(" ");
//     const commandKey = `${command.toLowerCase()} ${args.join(" ").toLowerCase()}`;

//     // Find matching command
//     const matchedCommand = Array.from(bot.commands.values()).find(cmd =>
//         cmd.commands.some(alias => command.toLowerCase() === `${commandPrefix}${alias}`)
//     );

//     if (!matchedCommand) return; // No valid command found

//     // Check if command is disabled
//     if (config.commands.hasOwnProperty(command) && !config.commands[command]) {
//         return;
//     }

//     const spamCheck = antiSpamHandler(uuid, commandKey);

//     if (spamCheck.action === "blacklist") {
//         bot.updateLists(uuid, "add", "blacklist");
//         bot.Whisper(user, `I am ignoring you ${user} because you are spamming (${spamCheck.reason}).`);
//         return;
//     }

//     if (spamCheck.action === "wait") {
//         bot.Whisper(user, `Please wait a few seconds before sending more commands, ${user}.`);
//         return;
//     }

//     if (spamCheck.action === "allow") {

//         if (matchedCommand.whitelisted && !bot.userWhitelist.has(uuid)) {
//             bot.Whisper(user, `Sorry, ${user}, you are not allowed to use this command.`);
//             return;
//         }

//         Logger.command(user, message);
//         matchedCommand.execute(user, args, bot, api);
//     }
// }
