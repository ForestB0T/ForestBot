import chalk      from "chalk";
import { client } from "../../index.js";

const log = (text: string, color: string, discordChat?: boolean) => {
    console.log(chalk[color](`${text}`))
    if (discordChat) 
        client.chatEmbed(text, color);
}

const error = (text: string) => console.log(chalk.red(`[ERROR] ${text}`))

export { log, error };