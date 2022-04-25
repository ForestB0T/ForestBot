import chalk from "chalk";
import { client } from "../../index.js";

export const log =  (text: string, color: string, discordChat?: boolean) => {
    console.log(chalk[color](`${text}`))
    if (discordChat) 
        client.chatEmbed(text, color);
}

export const error = (text: string) => console.log(chalk.red(`[ERROR] ${text}`))