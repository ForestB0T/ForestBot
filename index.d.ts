
type User = {
    username: string,
    uuid:     string,
    message?: string
}

interface BotInterface {
    bot: MineflayerBot;

    useWhitelist: boolean;
    welcomeMsgs: boolean;
    mc_server: string;

    userWhitelist: Set<string>;
    userBlacklist: Set<string>;
    whitelistedCmds: Set<string>;
    commands: Map<string, MCommand>;

    restartCount: number;
    isConnected: boolean;
    allowConnection: boolean;

    startBot(): Promise<void>;
    Whisper(user: string, message: string): void;
    endAndRestart(): Promise<void>;
    getPlayers(): Player[];
    updateLists(user: string, action: "add" | "remove", type: "blacklist" | "whitelist"): Promise<void>;
    loadCommands(): Promise<void>;
    handleEvents(bot: MineflayerBot): Promise<void>;
}

type MCommand = {
    commands: string[],
    description:? string,
    minArgs:  number,
    maxArgs:  number,
    whitelisted?: boolean,
    execute:  (user: string, args: any[], bot: Bot, api: ForestBotApiClient) => Promise<void>
}

interface OfflineMessage {
    sender: string;
    recipient: string;
    message: string;
    timestamp: number;
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

    announce:               boolean

    useForestBotAI:         boolean

    antiafk:                boolean

    use_mc_whitelist:       boolean

    reconnect_time:         number

    anti_spam_cooldown:     number
    anti_spam_msg_limit:    number

    welcome_messages:       boolean

    whitelisted_commands:   string[]

    useLegacyChat:          boolean

    useCommands:            boolean;
    commands:               {};

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
    bot:           Bot,
    cooldown_time: number,
    spam_limit:    number
}