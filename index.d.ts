type User = {
    username: string,
    uuid:     string,
    message?: string
}

type MCommand = {
    commands: string[],
    minArgs:  number,
    maxArgs:  number,
    execute:  (user: string, args: any[], bot: Bot, api: ForestBotApiClient) => Promise<void>
}

type Config = {
    mc_server: string
    host: string
    port: number,
    version: string
    api_url: string
    websocket_url: string

    useLogger: boolean

    prefix: "!" | "?" | "-" | "="
    useCustomChatPrefix:    boolean 
    customChatPrefix:       string
    whisperCommand:         string

    useForestBotAI:         boolean

    antiafk: boolean

    use_mc_whitelist:       boolean

    reconnect_time:         number

    anti_spam_cooldown:     number
    anti_spam_msg_limit:    number

    welcome_messages:       boolean

    whitelisted_commands:   string[]

    useCommands: boolean;
    commands: {};

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