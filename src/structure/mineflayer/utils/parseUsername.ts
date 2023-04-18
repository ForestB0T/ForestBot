import type { Bot } from "mineflayer";

export default function parseUsername(name: string, bot: Bot): string {
    name = name.replace(/[^_\w\d]/g, '');

    if (bot.players[name] && name === bot.players[name].displayName.toString()) return name;

    let realName: string;

    for (const user of Object.keys(bot.players)) {
      let displayName = bot.players[user].displayName.toString();
      let displayNameSplit = displayName.split(" ");
      if (displayNameSplit.length >= 2) {
        displayName = displayNameSplit[1];
      }

      if (name.includes(displayName) || name.includes(user)) {
        realName = user;
        break;
      }
      
    }

    return realName??name;
}