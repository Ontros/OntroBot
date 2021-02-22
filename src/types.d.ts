type Member = {
    channelID: string;
    guild: Guild;
    id: string;
    voice: VoiceState;
    user: User;
    hasPermission: (perm: string) => boolean;
    roles: any;
    permissionsIn: (chan: Channel | VoiceChannel) => Permission;
};

type Guild = {
    id: number;
    members: any;
    role: any;
    me: Member;
    member: (arg1: String)=>boolean;
    channels: Channels;
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