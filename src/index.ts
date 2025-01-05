import Discord, { Events, TextChannel, VoiceBasedChannel } from 'discord.js'
const youtube = require('simple-youtube-api');
import { Client, Guild, GuildMember, Message, VoiceChannel, VoiceState } from "discord.js";
import { Commands, CreateEmbed, GetRole, GetTextChannel, GetUser, GetVoiceChannel, Lang, LangJ, ProgressBar, ReactionForm, Server, ServerManager, TextInput } from "./types";
import schedule from "node-schedule"
const emojiDic = require("emoji-dictionary")
import path from 'path';
import dotenv from 'dotenv'
import fs from 'fs'
import serverManager from './server-manager'
import createEmbed from './utils/createEmbed';
import language from './language';

type Servers = {
    [index: string]: Server;
}

type UserBalance = {
    [index: string]: number;
}

declare global {
    namespace NodeJS {
        interface Global {
            bot: Client;
            servers: Servers;
            userBalance: UserBalance;
            commands: Commands;
            YouTube: any;
            SPOTIFY_OAUTH: string;
            SPOTIFY_CLIENT: string;
        }
    }
}

dotenv.config({ path: path.join(__dirname + './../.env') });
if (!process.env.SPOTIFY_OAUTH || !process.env.SPOTIFY_CLIENT) { throw new Error('SPOTIFY_OAUTH missing') }
global.bot = new Discord.Client({ intents: 131071 });
global.servers = {};
global.userBalance = {};
global.commands = {}
global.YouTube = new youtube(process.env.YT_TOKEN);
global.SPOTIFY_OAUTH = process.env.SPOTIFY_OAUTH
global.SPOTIFY_CLIENT = process.env.SPOTIFY_CLIENT
const { bot } = global

const token = process.env.DJS_TOKEN;

bot.on('ready', () => {
    if (process.env.STATUS) {
        if (bot.user) {
            bot.user.setActivity(process.env.STATUS)
        }
    }
    const base_file = 'command-base.js'
    const commandBase = require(`./commands/${base_file}`)

    const readCommands = (dir: string) => {
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
                commandBase.default(option.default, loc);
            }
        }
    }

    readCommands('commands');
    console.log('This bot is online!')
})

//TODO: add back
// bot.on('raw', packet => {
//     if (!['MESSAGE_REACTION_ADD', 'MESSAGE_REACTION_REMOVE'].includes(packet.t)) return;
//     const channel = bot.channels.cache.get(packet.d.channel_id);
//     if (!channel) { console.log('No channel found (index.tx)'); return }
//     if (!channel.isTextBased()) { return }
//     if (channel.messages.cache.has(packet.d.message_id)) return;
//     channel.messages.fetch(packet.d.message_id).then((message: Message) => {
//         const emoji = packet.d.emoji.id ? `${packet.d.emoji.name}:${packet.d.emoji.id}` : packet.d.emoji.name;
//         const reaction = message.reactions.cache.get(emoji);
//         if (!reaction) { console.log('Reaction not found (index.ts)'); return }
//         const user = bot.users.cache.get(packet.d.user_id)
//         if (!user) { console.log('User not found (index.ts)'); return }
//         if (packet.t as string === 'MESSAGE_REACTION_ADD') { bot.emit(Events.MessageReactionAdd, reaction, user); }
//         if (packet.t as string === 'MESSAGE_REACTION_REMOVE') { bot.emit(Events.MessageReactionRemove, reaction, user); }
//     });
// });


bot.on('voiceStateUpdate', async (oldMember: VoiceState, newMember: VoiceState) => {
    let newUserChannel = newMember.channelId;
    let oldUserChannel = oldMember.channelId;

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
                    if (user.voice.channelId) {
                        //je ve voice channelu
                        //user.user.send("ČEKÁRNA!");
                        user.user.send({
                            embeds: [createEmbed(
                                //@ts-ignore
                                null,
                                "Čekárna",
                                newMember.member?.nickname,
                                [],
                                newMember.member?.user.avatarURL()
                            )]
                        })
                    }
                });
            }
        }
        else if (newUserChannel === null) {
            // User leaves a voice channel
        }
    }
})

bot.on('voiceStateUpdate', async (oldState: VoiceState, newState: VoiceState) => {
    try {
        //Logging
        try {
            if (oldState.channelId !== newState.channelId) {
                serverManager(newState.guild.id, false)
                if (!global.servers[newState.guild.id].logServer) {
                    return
                }
                var logOrDis = ""
                if (!newState.channelId) {
                    //disconnect
                    logOrDis = "disconnected from"
                }
                else {
                    //connect
                    logOrDis = "connected to"
                }
                if (!process.env.LOGGING_CHANNEL) {
                    console.log("missing ENV LOGGING CHANNEL")
                    return
                }
                const channel = await bot.channels.fetch(process.env.LOGGING_CHANNEL, { cache: false })
                if (channel && channel.isTextBased()) {
                    var member: GuildMember | null = newState.member || oldState.member
                    var voiceChannel: VoiceBasedChannel | null = oldState.channel || newState.channel;
                    (channel as TextChannel).send(`${member?.nickname || member?.user.username} has ${logOrDis} ${voiceChannel?.name}`)
                }
                else {
                    console.log("logging channel isnt text")
                }
            }

        }
        catch { console.log("error logging") }
        //disconnect
        if (!newState.channelId && oldState.member?.id === bot.user?.id) {
            if (!newState.member || !newState.member.guild.id) { console.log('index.js bot disconnect no guild'); return }
            var server = global.servers[newState.member.guild.id]
            if (server.dispathcher) {
                server.dispathcher.connection.destroy();
            }
            server.queue = []
        }
        //server mute
        else if (newState.member && newState.member.id === bot.user?.id) {
            var server = global.servers[newState.member.guild.id]
            if (newState.serverMute) {
                if (server.player) {
                    try {
                        server.player.pause();
                    }
                    catch { }
                }
            }
            else {
                if (server.player) {
                    try {
                        server.player.unpause();
                    } catch { }
                }
            }
        }
    }
    catch {
        console.log('index js 216 error')
    }
})
process.on("unhandledRejection", (e) => { console.log(e, "unhandled promise rejection") })
bot.on("messageReactionRemove", async (reaction, user) => {
    if (user.bot) { return }
    if (user.partial) { user = await user.fetch() }
    if (!reaction.message.guild) { return; }
    serverManager(reaction.message.guild.id)
    var server = global.servers[reaction.message.guild.id]
    if (!server.roleGiver) { return }
    if (server.roleGiver.messageID !== reaction.message.id) { return }
    const member = reaction.message.guild.members.cache.get(user.id)
    //@ts-ignore
    if (!member) { console.log('reaction no member (index.ts)'); user.send(language(reaction.message.guild.id, 'UNKWN_ERR_HALT')); return }
    var emojiString: string = emojiDic.getName(reaction.emoji.toString())

    var roleIndex = server.roleGiver.roleReactions.findIndex((value) => {
        return value.emoji === emojiString
    })

    if (reaction.count === 0) {
        reaction.message.react(reaction.emoji)
    }

    if (roleIndex != -1) {
        member.roles.remove(server.roleGiver.roleReactions[roleIndex].roleID)
    }
})

//Rule reaction
bot.on("messageReactionAdd", async (reaction, user) => {
    if (user.bot) { return }
    if (user.partial) { user = await user.fetch() }
    if (!reaction.message.guild) { return; }
    serverManager(reaction.message.guild.id)
    var server = global.servers[reaction.message.guild.id]
    if (!server.roleGiver) { return }
    if (server.roleGiver.messageID !== reaction.message.id) { return }
    const member = reaction.message.guild.members.cache.get(user.id)
    //@ts-ignore
    if (!member) { console.log('reaction no member (index.ts)'); user.send(language(reaction.message.guild.id, 'UNKWN_ERR_HALT')); return }
    var emojiString: string = emojiDic.getName(reaction.emoji.toString())

    var roleIndex = server.roleGiver.roleReactions.findIndex((value) => {
        return value.emoji === emojiString
    })

    if (reaction.count === 1) {
        reaction.message.react(reaction.emoji)
    }

    if (roleIndex != -1) {
        member.roles.add(server.roleGiver.roleReactions[roleIndex].roleID)
    }
    else {
        user.send("no, bad emoji")
        reaction.remove()
    }

})
//@ts-ignore
global.bot.setMaxListeners(0)

bot.login(token);