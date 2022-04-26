type User = {
    username: string,
    uuid:     string,
    message?: string
}

type Config = {
    mc_server: string
    api_url:   string

    use_mc_whitelist:       boolean
    mc_whitelist:           string[],
    mc_blacklist:           string[],

    use_discord:            boolean
    main_discord_channel:   string
    discord_whitelist:      string[]
    discord_blacklist:      string[]

    reconnect_time:         number

    anti_spam_cooldown:     number
    anti_spam_msg_limit:    number

    welcome_messages:       boolean
    advertise:              boolean

    whitelisted_commands:   string[]
    disabled_commands:      string[]
    useCommands:            boolean

    allow_chatbridge_input: boolean
}

type Colors = {
    red:    string
    green:  string
    purple: string
    yellow: string
    gray:   string
    pink:   string
}

type command = {
    commands: string[],
    minArgs:  number,
    maxArgs:  number,
    execute: (user: string, args: any[], bot: Bot) => void
};

type antiSpamArgsType = {
    user:          string,
    Bot:           Bot,
    cooldown_time: number,
    spam_limit:    number
}

type endpoints = {
    savePlaytime:   (user: string, mc_server: string) => Promise<any>
    savePvpKill:    (victim: string, murderer: string, deathmsg: string, mc_server: string) => Promise<any>
    savePveKill:    (victim: string, deathmsg: string, mc_server: string) => Promise<any>
    saveChat:       (user: string, msg: string, mc_server: string) => Promise<any>

    updateLeave:    (user: string, mc_server: string) => Promise<any>
    updateJoin:     (user: string, uuid: string, mc_server: string) => Promise<any>

    getChannels:    (mc_server: string) => Promise<any>
    getPlaytime:    (user: string, mc_server: string) => Promise<any>
    getJoindate:    (user: string, mc_server: string) => Promise<any>
    getJoins:       (user: string, mc_server: string) => Promise<any>
    getKd:          (user: string, mc_server: string) => Promise<any>
    getLastDeath:   (user: string, mc_server: string) => Promise<any>
    getLastMessage: (user: string, mc_server: string) => Promise<any>
    getLastSeen:    (user: string, mc_server: string) => Promise<any>
    getMessageCnt:  (user: string, mc_server: string) => Promise<any>
    getQuote:       (user: string, mc_server: string) => Promise<any>
    getUniquePcnt:  (mc_server: string) => Promise<any>
    getTopStat:     (stat: string, mc_server: string) => Promise<any>
    getFact:        (id: number|string) => Promise<any>
    getRandomFact:  () => Promise<any>

    addFact:        (user: string, fact: string, mc_server: string) => Promise<any>
}