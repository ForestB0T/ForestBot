type User = {
    username: string,
    uuid:     string,
    message?: string
}

type MCommand = {
    commands: string[],
    minArgs:  number,
    maxArgs:  number,
    execute:  (user: string, args: any[], bot: Bot) => Promise<any>|any
}

type Config = {
    mc_server: string
    host: string
    port: number,
    version: string
    api_url: string

    prefix: "!" | "?" | "-" | "="
    useCustomChatPrefix:    boolean 
    customChatPrefix:       string
    whisperCommand:         string

    useRawChat: boolean
    antiafk: boolean

    use_mc_whitelist:       boolean

    reconnect_time:         number

    anti_spam_cooldown:     number
    anti_spam_msg_limit:    number

    welcome_messages:       boolean

    whitelisted_commands:   string[]

    useCommands: boolean;
    commands: {
        bp:       boolean;
        kill:     boolean;
        coords:   boolean;
        discord:  boolean;
        help:     boolean;
        joindate: boolean;
        joins:    boolean;
        kd:       boolean;
        lastdeath:boolean;
        lastseen: boolean;
        mount:    boolean;
        msgcount: boolean;
        owner:    boolean;
        ping:     boolean;
        playtime: boolean;
        quote:    boolean;
        sleep:    boolean;
        top:      boolean;
        urban:    boolean;
        wp:       boolean;
    }

    disabled_events:        string[]

    allow_chatbridge_input: boolean
    rotateHeadOnJoin: boolean
}

type Colors = {
    red:    string
    green:  string
    purple: string
    yellow: string
    gray:   string
    pink:   string
    blue:   string
}

type antiSpamArgsType = {
    user:          string,
    Bot:           Bot,
    cooldown_time: number,
    spam_limit:    number
}

type endpoints = {
    savePlaytime:   (users: string[], mc_server: string) => Promise<any>
    savePvpKill:    (victim: string, murderer: string, deathmsg: string, mc_server: string) => Promise<any>
    savePveKill:    (victim: string, deathmsg: string, mc_server: string) => Promise<any>
    saveChat:       (user: string, msg: string, mc_server: string) => Promise<any>
    saveAdvancement: (user: string, advancement: string, mc_server: string) => Promise<any>

    saveIam: (user: string, description: string) => Promise<any>

    updateLeave:    (user: string, mc_server: string) => Promise<any>
    updateJoin:     (user: string, uuid: string, mc_server: string) => Promise<any>

    updateplayerlist: (users: [{name: string, ping: number}], mc_server: string) => Promise<any>

    getNameFind: (user: string, mc_server: string) => Promise<any>
    getWhoIs: (user: string) => Promise<any>
    getChannels:    (mc_server: string) => Promise<any>
    getPlaytime:    (user: string, mc_server: string) => Promise<any>
    getJoindate:    (user: string, mc_server: string) => Promise<any>
    getJoins:       (user: string, mc_server: string) => Promise<any>
    getKd:          (user: string, mc_server: string) => Promise<any>
    getLastDeath:   (user: string, mc_server: string) => Promise<any>
    getLastMessage: (user: string, mc_server: string) => Promise<any>
    getFirstMessage: (user: string, mc_server: string) => Promise<any>

    getLastSeen:    (user: string, mc_server: string) => Promise<any>
    getMessageCnt:  (user: string, mc_server: string) => Promise<any>
    getQuote:       (user: string, mc_server: string) => Promise<any>
    getUniquePcnt:  (mc_server: string) => Promise<any>
    getTopStat:     (stat: string, mc_server: string) => Promise<any>

    getWordCount: (word: string, serv: string, user: string) => Promise<any>

    pingApi: () => Promise<any>
}