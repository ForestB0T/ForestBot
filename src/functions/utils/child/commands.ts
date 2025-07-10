import { exec } from 'child_process';
import { bot } from '../../..';

export async function updateBot() {
    return new Promise((resolve, reject) => {
        exec('git pull && rm -r node_modules && rm -r build && yarn && tsc', (error, stdout, stderr) => {
            if (error) {
                reject(error);
            } else {
                restartBot();
                resolve(stdout);
            }
        });
    });
}

export async function restartBot() {
    return new Promise(async (resolve, reject) => {
        try {
            await bot.endAndRestart();
            resolve('Bot restarted');
        } catch (err) {
            reject(err)
        }
    });
}