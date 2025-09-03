import chalk from "chalk";
import { config } from "../../config.js";

type LogType = "websocket" | "success" |"info" | "error" | "warn" | "debug" | "chat" | "advancement" | "death" | "join" | "leave" | "kick" | "login" | "logout" | "move" | "spawn" | "world" | "command";


/**
 * Main logger class for console logging.
 */
export class Logger {

    private static log(type: LogType, logStyle: typeof chalk, message: string) {
        if (!config.useLogger) return;
        const typePrefix = chalk.bold(chalk.white("[") + logStyle(`${type}`) + chalk.white("]"));
        const messageText = message ? `- ${message}` : "";
        const timestamp = new Date().toLocaleString();

        console.log(`${typePrefix} ${messageText} | ${chalk.gray(timestamp)}`);
    }

    public static chat(username: string, message: string, uuid: string, type: LogType = "chat") {
        this.log(type, chalk.red, `${chalk.white(message)}`);
    };

    public static advancement(message: string, type: LogType = "advancement") {
        this.log(type, chalk.yellow, message);
    };

    public static death(message: string, type: LogType = "death") {
        this.log(type, chalk.cyan, message);
    };

    public static join(username: string, uuid: string, type: LogType = "join") {
        this.log(type, chalk.magenta, `${chalk.bold(chalk.magenta(username))} joined the game.`);
    };

    public static leave(username: string, uuid: string, type: LogType = "leave") {
        this.log(type, chalk.magenta, `${chalk.bold(chalk.magenta(username))} left the game.`);
    };

    public static kick(reason: string, type: LogType = "kick") {
        this.log(type, chalk.red, reason);
    };

    public static login(message: string, type: LogType = "login") {
        this.log(type, chalk.green, message);
    };

    public static logout(message: string, type: LogType = "logout") {
        this.log(type, chalk.red, message);
    };

    public static move(message: string, type: LogType = "move") {
        this.log(type, chalk.blue, message);
    };

    public static spawn(message: string, type: LogType = "spawn") {
        this.log(type, chalk.green, message);
    };

    public static world(message: string, type: LogType = "world") {
        this.log(type, chalk.yellow, message);
    };

    public static command(username: string, message: string, type: LogType = "command") {
        this.log(type, chalk.cyan, `${chalk.bold(chalk.cyan(username))}: ran the command: ${chalk.white(message)}`);
    };

    public static info(message: string, type: LogType = "info") {
        this.log(type, chalk.blue, message);
    };

    public static error(reason: string, type: LogType = "error") {
        this.log(type, chalk.red, reason);
    };

    public static warn(reason: string, type: LogType = "warn") {
        this.log(type, chalk.yellow, reason);
    };

    public static success(message: string, type: LogType = "success") {
        this.log(type, chalk.greenBright, message);
    };

    public static websocket(message: string, type: LogType = "websocket") {
        this.log(type, chalk.yellow, message);
    };
};
