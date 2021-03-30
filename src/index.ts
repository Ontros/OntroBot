declare namespace NodeJS {
    interface Global {
      bot: Bot;
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
    }
}

global.Discord = require('discord.js');
global.YTDL = require('ytdl-core');
const youtube = require('simple-youtube-api');
global.fs = require('fs');
global.path = require('path');
global.bot = new global.Discord.Client();
const { Console } = require('console');
global.serverManager = require('././server-manager');
global.langJ = require('./../language.json');
global.Package = require('./../package.json');;
global.servers = [];
global.lang = require('./language.js');

const {fs, bot, path, serverManager} = global

require('dotenv').config({ path: path.join(__dirname+'./../.env') });
const token = process.env.DJS_TOKEN;
global.YouTube = new youtube(process.env.YT_TOKEN);



bot.on('ready', () => {
    console.log('This bot is online!')
    if (process.env.STATUS) {
        bot.user.setActivity(process.env.STATUS)
    }
    const base_file = 'command-base.js'
    const commandBase = require(`./commands/${base_file}`)

    const readCommands = (dir: String) => {
        const files = fs.readdirSync(path.join(__dirname, dir));
        for (const file of files) {
            const stat = fs.lstatSync(path.join(__dirname, dir, file));
            if (stat.isDirectory()) {
                //Složka
                readCommands(path.join(dir, file));
            } else if (file != base_file) {
                //Soubor
                const option = require(path.join(__dirname, dir, file));
                commandBase(option, file);
            }
        }
    }

    readCommands('commands');
})


bot.on('voiceStateUpdate', (oldMember: Member, newMember: Member) => {
    let newUserChannel: string = newMember.channelID;
    let oldUserChannel: string = oldMember.channelID;
  
    if (newUserChannel != oldUserChannel) {    
        if(newUserChannel !== null) {
            // User Joins a voice channel
            serverManager(newMember.guild.id);
            var server: Server = global.servers[newMember.guild.id];
            if (newUserChannel == server.cekarnaChannel) {
                //Nový čekač
                server.cekarnaPings.forEach(element => {
                    var server: Guild = bot.guilds.cache.find((guild: Guild) => guild.id === newMember.guild.id);
                    var user: Member = server.members.cache.find((user: Member) => user.id === element);
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
