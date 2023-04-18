import MineflayerBot, { ControlState } from 'mineflayer';
import chalk from 'chalk';
import { Logger } from "../../../index.js";

export default function antiafk(bot: MineflayerBot.Bot) {
  Logger.world("AntiAFK Started...");
  let moveinterval = 2; 
  let maxrandom = 5; 
  let lasttime = -1;
  let moving = 0;
  let actions: ControlState[] = ['forward', 'back', 'left', 'right']
  let lastaction: ControlState;
  let pi = 3.14159;

  bot.on('time', function () {
    let randomadd = Math.random() * maxrandom * 20;
    let interval = moveinterval * 20 + randomadd;
    if (bot.time.age - lasttime > interval) {
      if (moving == 1) {
        bot.setControlState(lastaction, false);
        moving = 0;
        lasttime = bot.time.age;
      } else {
        let yaw = Math.random() * pi - (0.5 * pi);
        let pitch = Math.random() * pi - (0.5 * pi);
        bot.look(yaw, pitch, false);
        lastaction = actions[Math.floor(Math.random() * actions.length)];
        bot.setControlState(lastaction, true);
        moving = 1;
        lasttime = bot.time.age;
      }
    }
  });
};
