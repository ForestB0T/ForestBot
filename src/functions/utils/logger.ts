import chalk      from "chalk";

const log = (text: string, color: string, discordChat?: boolean) => {
    console.log(chalk[color](`${text}`))
}

const error = (text: string) => console.log(chalk.red(`[ERROR] ${text}`))

export { log, error };