import chalk from "chalk";
import { client } from "../../index.js";

export default { 
    log: (text: string, color: string, discordChat?: boolean) => {
        console.log(chalk[color](`${text}`))
        if (discordChat) 
            client.chatEmbed(text, color);
    },
    error: (text: string) => console.log(chalk.red(`[ERROR] ${text}`)),
}