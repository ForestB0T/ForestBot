import { ForestBotApiClient } from "forestbot-api";
import type Bot from "../structure/mineflayer/Bot.js";

export default {
  commands: ["bp", "bestping"],
  minArgs: 0,
  maxArgs: 1,
  execute: async (user, args, bot, api: ForestBotApiClient) => {
    var word1 = [
      "Rabid",
      "Radiant",
      "Radical",
      "Radioactive",
      "Rakish",
      "Rambunctious",
      "Rampant",
      "Raspy",
      "Ratty",
      "Raucous",
      "Ravenous",
      "Rebellious",
      "Recalcitrant",
      "Recondite",
      "Reliable",
      "Repulsive",
      "Resilient",
      "Restless",
      "Rhetorical",
      "Ruthless",
      "Registered",
    ];
    var word2 = [
      "Raiders",
      "Retards",
      "Rebels",
      "Revolutionaries",
      "Reapers",
      "Rickrollers",
      "Rammsteins",
    ];
    var r1 = Math.floor(Math.random() * word1.length);
    var r2 = Math.floor(Math.random() * word2.length);
    return bot.bot.chat("RR = " + word1[r1] + " " + word2[r2]);
  },
} as MCommand;
