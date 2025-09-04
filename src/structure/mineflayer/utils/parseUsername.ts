import type { Bot } from "mineflayer";

export default function parseUsername(name: string, bot: Bot): string {
    // remove everything except word chars, underscores, numbers
    name = name.replace(/[^_\w\d]/g, '');

    // remove leading "<" if present
    if (name.startsWith("<")) {
        name = name.slice(1);
    }

    // if exact match, return early
    if (bot.players[name] && name === bot.players[name].displayName.toString()) {
        return name;
    }

    // try to resolve real username
    for (const user of Object.keys(bot.players)) {
        let displayName = bot.players[user].displayName.toString();

        // handle case where display name has rank/prefix
        let displayNameSplit = displayName.split(" ");
        if (displayNameSplit.length >= 2) {
            displayName = displayNameSplit[1];
        }

        // strict equality check, not includes
        if (name === displayName || name === user) {
            return user;
        }
    }

    // fallback
    return name;
}
