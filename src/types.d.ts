import * as Discord from "discord.js";

/*//import * as dtypes from 'discord.js'

//import { GuildMember } from "discord.js";

/*Guild
type Member = {
    channelID: string;
    guild: Guild;
    id: string;
    voice: VoiceState;
    user: User;
    hasPermission: (perm: string) => boolean;
    roles: GuildMemberRoleManager;
    permissionsIn: (chan: Channel | VoiceChannel) => Permission;
    setNickname: (nick: string)=>Promise<Member>;
    displayName: string;
};


type Guild = {
    id: number;
    members: any;
    role: any;
    me: Member;
    member: (arg1: String)=>Member;
    channels: Channels;
    roles: Roles;
};

type Server = {
    queue: Song[];
    dispathcher?: Dispatcher;
    loop: boolean;
    connection?: VoiceConnection;
    playing: boolean;
    volume: number;
    language: string;
    cekarnaChannel: string;
    cekarnaPings: string[];
    steps: Step[];
};

type Channels = {
    cache: ChannelsCaches;
}

type ChannelsCaches = {
    get: (arg0: ((arg1: Channel) => boolean)|string) => Channel;
};

type Song = {
    title: string;
    id: string;
    url: string;
    requestedBy: string;
};

type VoiceConnection = {
    play: (arg0: any) => Dispatcher;
    disconnect: () => void;
};

type Dispatcher = {
    setVolume: (vol: number) => void;
    destroy: () => void;
    resume: () => void;
    on: (arg0: string, call: Function) => void;
    pause: () => void;
    end: () => void;
};

var send = () => { };

type User = {
    username: string;
    send: (message: string) => void;
    id: string;
    avatarURL: () => string;
    setActivity: (arg0: (string | undefined)) => void;
};

type VoiceState = {
    channelID: string;
    channel: VoiceChannel;
};

type CommandOptions = {
    commands: string | string[];
    expectedArgs: string;
    permissionError: string;
    minArgs: number;
    maxArgs: number;
    permissions: string[];
    requiredRoles: string[];
    allowedIDs: string[];
    allowedServer: string;
    callback: Function;
    requireChannelPerms: boolean;
};

type Message = {
    channel: Channel;
    guild: Guild;
    content: string;
    member: Member;
    author: User;
    reply: (mes: string) => void;
    edit: (mes: string) => Promise<Message>;
    delete: () => Promise<Message>;
    createdTimestamp: number;
};

type Channel = {
    send: (mes: String) => Promise<Message>;
    VoiceChannel: VoiceChannel;
    type: string;
};

type Role = {
    name: string;
    id: string;
    position: number;
};

type VoiceChannel = {
    join: () => Promise<VoiceConnection>;
};

type Permission = {
    has: (perm: PermissionResolvable) => boolean;
};

type PermissionResolvable = string | number;

type Bot = {
    on: (arg0: string, call: Function) => void;
    setMaxListeners: (arg0: number) => void;
    login: (arg0: string | undefined) => void;
    guilds: Guilds;
    user: User;
    users: Users;
};

type Users = {
    cache: UserCaches;
}

type UserCaches = {
    find: (arg0: (arg1: User) => boolean) => User;
};

type Guilds = {
    cache: GuildCaches;
};

type GuildCaches = {
    find: (arg0: (arg1: Guild) => boolean) => Guild;
};
/*Serverova role (ne DC)
type Step = {
    id: string;
    name: string;
    emoji: string;
}

type Roles = {
    cache: RoleCache;
    fetch: (id: string | any) => Promise<Role>;
}

type RoleCache = {
    get: (id: string) => Role;
    has: (id: string) => boolean;
}

type GuildMemberRoleManager = {
    highest: Role;
    cache: RoleCache;
    add: (role: Role) => Promise<Member>;
    remove: (role: Role) => Promise<Member>;
}

type GetUser = (message: Message, arg0: string) => Promise<Member | null>;

type GetCur_role = (roles: Step[], user: Member) => {curStep: (Role | null); roleIndex: number}*/
type CommandOptions = {
    commands: string | string[];
    expectedArgs: string;
    permissionError: string;
    minArgs: number;
    maxArgs: number;
    permissions: Discord.PermissionString[];
    requiredRoles: Discord.RoleResolvable[];
    allowedIDs: string[];
    allowedServer: string;
    callback: Function;
    requireChannelPerms: boolean;
};

import { AudioPlayer, AudioResource, createAudioPlayer, createAudioResource, DiscordGatewayAdapterCreator, joinVoiceChannel, NoSubscriberBehavior, PlayerSubscription, VoiceConnection } from "@discordjs/voice";
type Server = {
    queue: Song[];
    dispathcher?: PlayerSubscription | undefined;
    audioResource: AudioResource<null> | undefined;
    player: AudioPlayer | undefined;
    loop: (0 | 1 | 2 | 3);
    connection?: VoiceConnection;
    playing: boolean;
    volume: number;
    language: Languages;
    cekarnaChannel: string;
    cekarnaPings: string[];
    steps: Step[];
    playlists: (Playlists | undefined)
    prefix: string;
    // config: Config
    roleGiver?: RoleGiver;
    logServer: boolean;
};

type RoleGiver = {
    messageID: string;
    roleReactions: RoleReaction[];
};

type RoleReaction = {
    emoji: string;
    roleID: string;
}

type Playlists = Playlist[]
type Playlist = { videos: Video[], name: string }
type Video = {
    id: string,
    title: string,
    //thumbnails: any
}
// thumbnails: {
//     default: {
//       url: 'https://i.ytimg.com/vi/m6XsA5RkIjI/default.jpg',
//       width: 120,
//       height: 90
//     },
//     medium: {
//       url: 'https://i.ytimg.com/vi/m6XsA5RkIjI/mqdefault.jpg',
//       width: 320,
//       height: 180
//     },
//     high: {
//       url: 'https://i.ytimg.com/vi/m6XsA5RkIjI/hqdefault.jpg',
//       width: 480,
//       height: 360
//     },
//     standard: {
//       url: 'https://i.ytimg.com/vi/m6XsA5RkIjI/sddefault.jpg',
//       width: 640,
//       height: 480
//     },
//     maxres: {
//       url: 'https://i.ytimg.com/vi/m6XsA5RkIjI/maxresdefault.jpg',
//       width: 1280,
//       height: 720
//     }
type Languages = "english" | "dev" | "czech";
type GetUser = (message: Discord.Message, arg0: string) => Promise<Discord.GuildMember | null>;
type GetCur_role = (roles: Step[], user: Member) => { curStep: (Discord.Role | null); roleIndex: number }
type Config = {
    rules: Rules
}

type Rules = {
    channelID: (Discord.Snowflake | null)
    roleID: (Discord.Snowflake | null)
}

interface Global {
    bot: Discord.Client;
    YTDL: any;
    YOUTUBE: any;
    fs: any;
    path: any;
    serverManager: any;
    langJ: any;
    Package: any;
    servers: Server[];
    lang: any;
    YouTube: any;
    Discord: any;
    getUser: GetUser;
}

type Step = {
    id: string;
    name: string;
    emoji: string;
}

type Song = {
    title: string;
    id: string;
    url: string;
    requestedBy: string;
    duration: ({
        days: number;
        hours: number;
        minutes: number;
        seconds: number;
    } | undefined)
    // duration: any
};

type ServerManager = (id: string, change?: boolean) => void
type Lang = (id: string, textId: string) => string

type LangJ = {
    languages: ["english", "dev", "czech"];
    [index: string]: Translations
}

type Translations = {
    [index: string]: Translation;
}

type Translation = {
    english: string;
    czech: string;
    dev?: string;
}

type Commands = { //used in server
    [index: string]: Category
}

type commands = { //used in category
    [index: string]: Command
}

type Category = {
    name: string
    commands: commands
}

type Command = {
    name: string
    aliases: string
    args: string
}

type ReactionFormOption = {
    callback: (FormCallback | null)
    title: string
}

type ButtonOption = {
    title: string
}

type FormCallback = (userMessage: Discord.Message, botMessage: (Discord.Message), reaction: Discord.MessageReaction) => void
type GetTextChannel = (message: Discord.Message, input: string) => (Discord.TextChannel | null)
type GetVoiceChannel = (message: Discord.Message, input: string) => (Discord.VoiceChannel | null)

type GetRole = (message: Discord.Message, input: string) => Promise<Discord.Role | null>

// type ButtonForm = (userMessage: Discord.Message, botMessage: (Discord.Message | null), title: string, question: string, buttonOptions: ButtonOption[]) => Promise<(ButtonFormOutput)>;
type ReactionForm = (userMessage: Discord.Message, botMessage: (Discord.Message | null), title: string, question: string, callbacks: ReactionFormOption[], deleteAfter?: boolean) => Promise<ReactionFormOutput>;
type CreateEmbed = (message: Discord.Message, title: string, description: (string | null), fields: (Discord.EmbedField[]), imageURL?: (string | null)) => Discord.MessageEmbed;
type ProgressBar = (message: Discord.Message, title: string, description: (string | null), status: number, imageURL?: (string | null)) => Discord.MessageEmbed
type TextInput = (userMessage: User.Message, botMessage: (Discord.Message | null), title: string, question: string, filter: ((input: string) => Promise<boolean>) | null) => Promise<TextInputOutput>
type TextInputOutput = {
    text: string;
    botMessage: Discord.Message;
    inputMessage: Discord.Message;
}

type ReactionFormOutput = {
    id: number;
    userMessage: Discord.Message;
    botMessage: Discord.Message;
    formOption: ReactionFormOption;
}

type ButtonOutput = {
    id: number;
    userMessage: Discord.Message;
    botMessage: Discord.Message;
}

type ScheaduledTime = {
    year: (undefined | null | string),
    month: (undefined | null | string),
    date: (undefined | null | string),
    dayOfWeek: (undefined | null | string),
    hour: (undefined | null | string),
    minute: (undefined | null | string),
    second: (undefined | null | string),
    repeatable: (boolean | null),
    name: string
}

type ScheaduledTimes = ScheaduledTime[]