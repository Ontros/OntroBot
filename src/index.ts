import { Client, Guild, GuildMember, Intents, VoiceState } from "discord.js";
import { GetUser, Server, Global, ServerManager, Lang, LangJ, Commands } from "./types";

type Servers = {
    [index: string]: Server;
}

declare global {namespace NodeJS {
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
    }
}}

global.Discord = require('discord.js');
global.YTDL = require('ytdl-core');
const youtube = require('simple-youtube-api');
global.fs = require('fs');
global.path = require('path');
let intents = new Intents(Intents.ALL);
global.bot = new global.Discord.Client({ ws: {intents: intents} });
const { Console } = require('console');
global.serverManager = require('././server-manager');
global.langJ = require('./../language.json');
global.Package = require('./../package.json');;
global.servers = {};
global.lang = require('./language.js');
global.getUser = require('./utils/getUser')
global.commands = require('./../commands.json')

const {fs, bot, path, serverManager} = global

require('dotenv').config({ path: path.join(__dirname+'./../.env') });
const token = process.env.DJS_TOKEN;
global.YouTube = new youtube(process.env.YT_TOKEN);



bot.on('ready', () => {
    console.log('This bot is online!')
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
})


bot.on('voiceStateUpdate', async (oldMember: VoiceState, newMember: VoiceState) => {
    let newUserChannel = newMember.channelID;
    let oldUserChannel = oldMember.channelID;
  
    if (newUserChannel != oldUserChannel) {    
        if(newUserChannel !== null) {
            // User Joins a voice channel
            serverManager(newMember.guild.id);
            newMember.guild.id
            var server: Server = global.servers[newMember.guild.id];
            if (newUserChannel == server.cekarnaChannel) {
                //Nový čekač
                server.cekarnaPings.forEach(async element => {
                    var server = bot.guilds.cache.find((guild: Guild) => guild.id === newMember.guild.id);
                    if(!server) {console.log('VoiceStateUpdate error');return}
                    var user = await server.members.fetch(element)
                    try {
                        console.log(user.user.username);
                    }
                    catch {
                        return;
                    }
                    if (user.voice.channelID) {
                        //je ve voice channelu
                        user.user.send("ČEKÁRNA!");
                    }
                });
            }
        } 
        else if(newUserChannel === null){
            // User leaves a voice channel
        }
    }
  })

const PREFIX = '_';
const OwnerID = '255345748441432064';
const LanguageList = ["dev", "eng", "czk"];

bot.setMaxListeners(0);

bot.login(token);
