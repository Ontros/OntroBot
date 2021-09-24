import { Client, Guild, Intents, Message, MessageReaction, PartialUser, User, VoiceState } from "discord.js";
import { ButtonForm, Commands, CreateEmbed, GetRole, GetTextChannel, GetUser, GetVoiceChannel, Lang, LangJ, ProgressBar, ReactionForm, Server, ServerManager, TextInput } from "./types";
import schedule from "node-schedule"

//TODO: npm command build and run docker
//TODO: npm command build docker
//TODO: npm command run docker

type Servers = {
    [index: string]: Server;
}

declare global {
    namespace NodeJS {
        interface Global {
            bot: Client;
            YTDL: any;
            YOUTUBE: any;
            fs: any;
            path: any;
            serverManager: ServerManager;
            langJ: LangJ;
            Package: any;
            servers: Servers;
            lang: Lang;
            YouTube: any;
            Discord: any;
            getUser: GetUser;
            commands: Commands;
            reactionForm: ReactionForm;
            createEmbed: CreateEmbed;
            textInput: TextInput;
            getTextChannel: GetTextChannel;
            getRole: GetRole;
            getVoiceChannel: GetVoiceChannel;
            disbut: any;
            buttonForm: ButtonForm;
            fetch: any;
            SPOTIFY_OAUTH: string;
            SPOTIFY_CLIENT: string;
            SpotifyToYoutube: any;
            SpotifyWebApi: any;
            progressBar: ProgressBar;
            schedule: typeof schedule;
        }
    }
}

global.Discord = require('discord.js');
global.YTDL = require('ytdl-core');
const youtube = require('simple-youtube-api');
global.fs = require('fs');
global.path = require('path');
let intents = new Intents(Intents.ALL);
global.bot = new global.Discord.Client({ ws: { intents: intents } });
const { Console } = require('console');
global.serverManager = require('././server-manager');
global.langJ = require('./../language.json');
global.Package = require('./../package.json');;
global.servers = {};
global.lang = require('./language.js');
global.getUser = require('./utils/getUser')
// global.commands = require('./../commands.json')
global.commands = {}
global.reactionForm = require('./utils/reactionForm')
global.createEmbed = require('./utils/createEmbed')
global.textInput = require('./utils/textInput')
global.getTextChannel = require('./utils/getTextChannel')
global.getVoiceChannel = require('./utils/getVoiceChannel')
global.getRole = require('./utils/getRole')
global.disbut = require('discord-buttons')(global.bot)
global.buttonForm = require('./utils/buttonForm')
const { fs, bot, path, serverManager } = global
require('dotenv').config({ path: path.join(__dirname + './../.env') });
global.fetch = require('node-fetch')
if (!process.env.SPOTIFY_OAUTH || !process.env.SPOTIFY_CLIENT) { throw new Error('SPOTIFY_OAUTH missing') }
global.SPOTIFY_OAUTH = process.env.SPOTIFY_OAUTH
global.SPOTIFY_CLIENT = process.env.SPOTIFY_CLIENT
global.SpotifyToYoutube = require('spotify-to-youtube')
global.SpotifyWebApi = require('spotify-web-api-node')
global.progressBar = require('./utils/progressBar')
global.schedule = schedule

const token = process.env.DJS_TOKEN;
global.YouTube = new youtube(process.env.YT_TOKEN);



bot.on('ready', () => {

    if (process.env.STATUS) {
        if (bot.user) {
            bot.user.setActivity(process.env.STATUS)
        }
    }
    const base_file = 'command-base.js'
    const commandBase = require(`./commands/${base_file}`)

    const readCommands = (dir: String) => {
        const files = fs.readdirSync(path.join(__dirname, dir));
        for (const file of files) {
            const loc = path.join(__dirname, dir, file);
            const stat = fs.lstatSync(path.join(__dirname, dir, file));
            if (stat.isDirectory()) {
                //Složka
                readCommands(path.join(dir, file));
            } else if (file != base_file) {
                //Soubor
                const option = require(path.join(__dirname, dir, file));
                commandBase(option, loc);
            }
        }
    }

    readCommands('commands');
    console.log('This bot is online!')
})

bot.on('raw', packet => {
    if (!['MESSAGE_REACTION_ADD', 'MESSAGE_REACTION_REMOVE'].includes(packet.t)) return;
    const channel = bot.channels.cache.get(packet.d.channel_id);
    if (!channel) { console.log('No channel found (index.tx)'); return }
    if (!channel.isText()) { return }
    if (channel.messages.cache.has(packet.d.message_id)) return;
    channel.messages.fetch(packet.d.message_id).then((message: Message) => {
        const emoji = packet.d.emoji.id ? `${packet.d.emoji.name}:${packet.d.emoji.id}` : packet.d.emoji.name;
        const reaction = message.reactions.cache.get(emoji);
        if (!reaction) { console.log('Reaction not found (index.ts)'); return }
        const user = bot.users.cache.get(packet.d.user_id)
        if (!user) { console.log('User not found (index.ts)'); return }
        if (packet.t === 'MESSAGE_REACTION_ADD') { bot.emit('messageReactionAdd', reaction, user); }
        if (packet.t === 'MESSAGE_REACTION_REMOVE') { bot.emit('messageReactionRemove', reaction, user); }
    });
});


bot.on('voiceStateUpdate', async (oldMember: VoiceState, newMember: VoiceState) => {
    let newUserChannel = newMember.channelID;
    let oldUserChannel = oldMember.channelID;

    if (newUserChannel != oldUserChannel) {
        if (newUserChannel !== null) {
            // User Joins a voice channel
            serverManager(newMember.guild.id);
            newMember.guild.id
            var server: Server = global.servers[newMember.guild.id];
            if (newUserChannel == server.cekarnaChannel) {
                //Nový čekač
                server.cekarnaPings.forEach(async element => {
                    var server = bot.guilds.cache.find((guild: Guild) => guild.id === newMember.guild.id);
                    if (!server) { console.log('VoiceStateUpdate error'); return }
                    var user = await server.members.fetch(element)
                    try {
                        var name = user.user.username;
                    }
                    catch {
                        return;
                    }
                    if (user.voice.channelID) {
                        //je ve voice channelu
                        //user.user.send("ČEKÁRNA!");
                        user.user.send(global.createEmbed(
                            //@ts-ignore
                            null,
                            "Čekárna",
                            newMember.member?.nickname,
                            [],
                            newMember.member?.user.avatarURL()
                        ))
                    }
                });
            }
        }
        else if (newUserChannel === null) {
            // User leaves a voice channel
        }
    }
})

bot.on('voiceStateUpdate', (oldState: VoiceState, newState: VoiceState) => {
    try {

        //disconnect
        if (!newState.channelID && oldState.member?.id === bot.user?.id) {
            console.log(oldState.member)
            console.log(newState.member)
            if (!newState.member || !newState.member.guild.id) { console.log('index.js bot disconnect no guild'); return }
            var server = global.servers[newState.member.guild.id]
            if (server.dispathcher) {
                server.dispathcher.destroy();
            }
            server.queue = []
        }
        //server mute
        else if (newState.member && newState.member.id === bot.user?.id) {
            var server = global.servers[newState.member.guild.id]
            if (newState.serverMute) {
                if (server.dispathcher) {
                    console.log(server.dispathcher)
                    try {
                        server.dispathcher.pause();
                    }
                    catch { }
                }
            }
            else {
                if (server.dispathcher) {
                    try {
                        server.dispathcher.resume();
                    } catch { }
                }
            }
        }
    }
    catch {
        console.log('index js 216 error')
    }
})

//Rule reaction
// bot.on("messageReactionAdd", async (reaction: MessageReaction, user: (User | PartialUser)) => {
//     if (user.bot) { return }
//     if (user.partial) { user = await user.fetch() }
//     if (!reaction.message.guild) { return; }
//     global.serverManager(reaction.message.guild.id)
//     var server = global.servers[reaction.message.guild.id]
//     if (!server.config.rules.channelID) { return }
//     if (!server.config.rules.roleID) { return }
//     if (server.config.rules.channelID !== reaction.message.channel.id) { return }
//     const member = reaction.message.guild.member(user)
//     if (!member) { console.log('reaction no member (index.ts)'); return }
//     member.roles.add(server.config.rules.roleID)
// })
const PREFIX = '_';
const OwnerID = '255345748441432064';
const LanguageList = ["dev", "eng", "czk"];

bot.setMaxListeners(0);

import { remaindersInit } from "./utils/index/startRemainders"
remaindersInit()

bot.login(token);
//TODO remove this
bot.addListener('message', (message) => {
    if (message.guild) { return }
    if (message.author === bot.user) { return }
    if (message.content === 'ahoj') { message.channel.send('ahoj') }
})