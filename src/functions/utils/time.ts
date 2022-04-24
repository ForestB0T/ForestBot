import date              from 'date-and-time';
import TimeAgo           from 'javascript-time-ago';
import { createRequire } from "module"; 
const require = createRequire(import.meta.url); 
const en = require('javascript-time-ago/locale/en.json') 

TimeAgo.addDefaultLocale(en)
const timeAgo = new TimeAgo('en-US');

export default {
    /**
     * 
     * Takes a timestamp and converts it to a readable format (takes milliseconds)
     * # # Day(s) # hours # minutes.
     * 
     * @param time number | string
     * @returns string
     */
    dhms: (time: string|number) => {
        if (typeof time === "string") time = parseInt(time);
        let d:number ,h:number ,m: number;
        d = Math.floor(time / (1000 * 60 * 60 * 24));
        h = Math.floor((time % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        m = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
        return `${d} Day(s) ${h} hours ${m} minutes.`;

    },

    /**
     * 
     * Takes a unix timestamp (seconds) and converts it to a readable format
     * example: 
     * # Apr 22 2022 13:15:12
     * @param time 
     * @returns string
     */
    convertUnixTimestamp: (time: number) => {
        const date    = new Date(time * 1000);
        const months  = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const year    = date.getFullYear();
        const month   = months[date.getMonth()];
        const day     = date.getDate();
        const hours   = date.getHours();
        const minutes = 0 + date.getMinutes();
        const seconds = 0 + date.getSeconds();
        return `${month} ${day} ${year} ${hours}:${minutes}:${seconds}`;
    },

    /**
     * This function returns a string of the current time.
     * example:
     * # Jul 09/21 at 08:30PM CDT
     * @returns string
     */
    dateTime: () => {
        const t = new Date();
        const p:string[] = date.compile("MMM DD/YY");
        return date.format(t, p) + " at " + date.format(t, "hh:mmA [CDT]");
    },

    /**
     * This function will await a promise for x amount of milliseconds
     * @param ms 
     * @returns Promise<void>
     */
    sleep: (ms: number) => new Promise(resolve => setTimeout(resolve, ms)),
    
    /**
     * Takes in a timestamp and returns a readable time ago string
     * example:
     * ### 1 minute ago
     * ### 2 hours ago
     * ### 3 days ago
     * @param time 
     * @returns string
     */
    timeAgoStr: (time: number) => timeAgo.format(time)

}