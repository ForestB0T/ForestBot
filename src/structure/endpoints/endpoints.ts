import { fetchApi, postApi } from "../../functions/Fetch/fetch.js"

/**
 * Endpoints for ForestBot api
 */
export default {

    savePlaytime: async (users, mc_server) => postApi(`saveplaytime`, { players: users, mc_server: mc_server }),
    savePvpKill: async (victim, murderer, deathmsg, mc_server) => postApi(`savepvpkill`, { victim: victim, murderer: murderer, deathmsg: deathmsg, mc_server: mc_server }),
    savePveKill: async (victim, deathmsg, mc_server) => postApi(`savepvekill`, { victim: victim, deathmsg: deathmsg, mc_server: mc_server }),
    saveChat: async (user, message, mc_server) => postApi('savechat', { user, message, mc_server }),
    saveAdvancement: async (user, advancement, mc_server) => postApi("saveadvancement", { user, advancement, mc_server }),

    saveIam: async (user, description) => postApi("iam", { user: user, description: description }),

    updateLeave: async (user, mc_server) => postApi(`updateleave`, { user: user, mc_server: mc_server, time: Date.now() }),
    updateJoin: async (user, uuid, mc_server) => postApi(`updatejoin`, { user: user, uuid: uuid, mc_server: mc_server, time: Date.now() }),

    updateplayerlist: async (users, mc_server) => postApi(`updateplayerlist`, { users: users, mc_server: mc_server }),

    getNameFind: async (user, mc_server) => fetchApi(`namefind/${user}/${mc_server}`),
    getWhoIs: async (user) => fetchApi(`whois/${user}`),
    getChannels: async (mc_server) => fetchApi(`getchannels/${mc_server}/${process.env.apiKey}`),
    getPlaytime: async (user, mc_server) => fetchApi(`playtime/${user}/${mc_server}`),
    getJoindate: async (user, mc_server) => fetchApi(`joindate/${user}/${mc_server}`),
    getJoins: async (user, mc_server) => fetchApi(`joins/${user}/${mc_server}`),
    getKd: async (user, mc_server) => fetchApi(`kd/${user}/${mc_server}`),
    getLastDeath: async (user, mc_server) => fetchApi(`lastdeath/${user}/${mc_server}`),
    getLastMessage: async (user, mc_server) => fetchApi(`messages/${user}/${mc_server}/1/last`),
    getFirstMessage: async (user, mc_server) => fetchApi(`messages/${user}/${mc_server}/1/first`),
    getLastSeen: async (user, mc_server) => fetchApi(`lastseen/${user}/${mc_server}`),
    getMessageCnt: async (user, mc_server) => fetchApi(`messagecount/${user}/${mc_server}`),
    getQuote: async (user, mc_server) => fetchApi(`quote/${user}/${mc_server}`),
    getUniquePcnt: async (mc_server) => fetchApi(`uniqueplayers/${mc_server}`),
    getTopStat: async (stat, mc_server) => fetchApi(`topstat/${stat}/${mc_server}`),
    getWordCount: async(word, serv, user) => fetchApi(`wordcount/${word}/${user}/${serv}`),
    pingApi: async () => fetchApi(`ping`)

} as endpoints;