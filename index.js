const Discord = require('discord.js');
const YTDL = require('ytdl-core');
const youtube = require('simple-youtube-api');
const fs = require('fs');
const path = require('path');
const bot = new Discord.Client();
const { Console } = require('console');
const serverManager = require('././server-manager');

require('dotenv').config({path: __dirname + '/.env'})
const token = process.env.DJS_TOKEN;
const YouTube = new youtube(process.env.YT_TOKEN);

bot.on('ready', () => {
    console.log('This bot is online!')
    const base_file = 'command-base.js'
    const commandBase = require(`./commands/${base_file}`)

    const readCommands = dir => {
        const files = fs.readdirSync(path.join(__dirname, dir));
        for (const file of files) {
            const stat = fs.lstatSync(path.join(__dirname, dir, file));
            if (stat.isDirectory()) {
                //Složka
                readCommands(path.join(dir, file));
            } else if (file != base_file) {
                //Soubor
                const option = require(path.join(__dirname, dir, file));
                commandBase(bot, option);
            }
        }
    }

    readCommands('commands');
})

bot.on('voiceStateUpdate', (oldMember, newMember) => {
    let newUserChannel = newMember.channelID;
    let oldUserChannel = oldMember.channelID;
  
    if (newUserChannel != oldUserChannel) {    
        if(newUserChannel !== null) {
            // User Joins a voice channel
            serverManager(newMember.guild.id);
            if (newUserChannel == servers[newMember.guild.id].cekarnaChannel) {
                //Nový čekač
                servers[newMember.guild.id].cekarnaPings.forEach(element => {
                    var server = bot.guilds.cache.find(guild => guild.id === newMember.guild.id);
                    var user = server.members.cache.find(user => user.id === element);
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
global.servers = {};
bot.setMaxListeners(0);


bot.login(token);