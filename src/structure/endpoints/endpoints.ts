import { fetchApi, postApi } from "../../functions/Fetch/fetch.js"
import { websocket }         from "../../index.js";

/**
 * Endpoints for ForestBot api
 */
 
export default { 

    savePlaytime:   async (user: string, mc_server: string) => postApi(`saveplaytime`, { user: user, mc_server: mc_server, time: 60000 }),
    savePvpKill:    async (victim: string, murderer: string, deathmsg: string, mc_server: string) => postApi(`savepvpkill`, {victim: victim, murderer: murderer, deathmsg: deathmsg, mc_server: mc_server}),
    savePveKill:    async (victim: string, deathmsg: string, mc_server: string) => postApi(`savepvekill`, { victim: victim, deathmsg: deathmsg, mc_server: mc_server}),
    saveChat:       async (user: string, message: string, mc_server: string) => postApi('savechat',{user, message, mc_server}),

    updateLeave:    async (user: string, mc_server: string) => postApi(`updateleave`, { user: user, mc_server: mc_server, time: Date.now()}),
    updateJoin:     async (user: string, uuid: string, mc_server: string) => postApi(`updatejoin`, {user: user, uuid: uuid, mc_server: mc_server, time: Date.now()}),

    getChannels:    async (mc_server: string)               => fetchApi(`getchannels/${mc_server}/${process.env.apiKey}`),
    getPlaytime:    async (user: string, mc_server: string) => fetchApi(`playtime/${user}/${mc_server}`),
    getJoindate:    async (user: string, mc_server: string) => fetchApi(`joindate/${user}/${mc_server}`),
    getJoins:       async (user: string, mc_server: string) => fetchApi(`joins/${user}/${mc_server}`),
    getKd:          async (user: string, mc_server: string) => fetchApi(`kd/${user}/${mc_server}`),
    getLastDeath:   async (user: string, mc_server: string) => fetchApi(`lastdeath/${user}/${mc_server}`),
    getLastMessage: async (user: string, mc_server: string) => fetchApi(`lastmessage/${user}/${mc_server}`),
    getLastSeen:    async (user: string, mc_server: string) => fetchApi(`lastseen/${user}/${mc_server}`),
    getMessageCnt:  async (user: string, mc_server: string) => fetchApi(`messagecount/${user}/${mc_server}`),
    getQuote:       async (user: string, mc_server: string) => fetchApi(`quote/${user}/${mc_server}`),
    getUniquePcnt:  async (mc_server: string)               => fetchApi(`uniqueplayers/${mc_server}`),
    getTopStat:     async (stat: string, mc_server: string) => fetchApi(`topstat/${stat}/${mc_server}`),
    
} as endpoints;