import type Bot from "../Bot";

interface AntiSpamResult {
    action: "allow" | "blacklist" | "wait";
    reason?: string;
}
import { config } from "../../../config.js";
import { Logger, api } from "../../../index.js";

interface UserCommandData {
    lastCommands: { commandKey: string, time: number }[];
    lastCommandTime: number;
    commandCount: number;
}

// Tracks user command usage
const userCommandTracker: Map<string, UserCommandData> = new Map();

function antiSpamHandler(
    uuid: string,
    commandKey: string
): AntiSpamResult {

    const cooldownTime = config.anti_spam_cooldown; // 5 seconds
    const spamLimit = config.anti_spam_msg_limit; // 5 commands within cooldown time
    const blacklistTime = 1 * 60 * 1000; // 2 minutes

    // Initialize user data if not present
    if (!userCommandTracker.has(uuid)) {
        userCommandTracker.set(uuid, { lastCommands: [], lastCommandTime: 0, commandCount: 0 });
    }

    const userData = userCommandTracker.get(uuid)!;
    const currentTime = Date.now();

    // Check cooldown
    if (currentTime - userData.lastCommandTime < cooldownTime) {
        userData.commandCount++;
        if (userData.commandCount >= spamLimit) {
            userCommandTracker.delete(uuid);
            return { action: "blacklist", reason: "too many commands during cooldown" };
        }
        return { action: "wait", reason: "command sent during cooldown" };
    }

    userData.commandCount = 1; // Reset command count after cooldown
    userData.lastCommandTime = currentTime;

    // Track last 10 commands
    userData.lastCommands.push({ commandKey, time: currentTime });
    if (userData.lastCommands.length > 5) {
        userData.lastCommands.shift();
    }

    // Check for repeated commands within 2 minutes
    if (userData.lastCommands.length === 5 && userData.lastCommands.every(cmd => cmd.commandKey === commandKey && currentTime - cmd.time <= blacklistTime)) {
        userCommandTracker.delete(uuid);
        return { action: "blacklist", reason: "repeated command spam within 2 minutes" };
    }

    if (userData.lastCommands.length === 5) {
        userData.lastCommands = []; // Clear the lastCommands array
        userCommandTracker.set(uuid, userData);
    }

    return { action: "allow" };
}

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

    console.log(matchedCommand)

    if (!matchedCommand) return; // No valid command found

    // Check if command is disabled
    if (config.commands.hasOwnProperty(command) && !config.commands[command]) {
        return;
    }

    const spamCheck = antiSpamHandler(uuid, commandKey);

    if (spamCheck.action === "blacklist") {
        bot.updateLists(uuid, "add", "blacklist");
        bot.Whisper(user, `I am ignoring you ${user} because you are spamming (${spamCheck.reason}).`);
        return;
    }

    if (spamCheck.action === "wait") {
        bot.Whisper(user, `Please wait a few seconds before sending more commands, ${user}.`);
        return;
    }

    if (spamCheck.action === "allow") {

        if (matchedCommand.whitelisted && !bot.userWhitelist.has(uuid)) {
            bot.Whisper(user, `Sorry, ${user}, you are not allowed to use this command.`);
            return;
        }

        Logger.command(user, message);
        matchedCommand.execute(user, args, bot, api);
    }
}
