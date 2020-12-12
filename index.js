const Discord = require('discord.js');
const YTDL = require('ytdl-core');
const youtube = require('simple-youtube-api');
const fs = require('fs');
const path = require('path');
const bot = new Discord.Client();
const { Console } = require('console');

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

const PREFIX = '_';
const OwnerID = '255345748441432064';
const LanguageList = ["dev", "eng", "czk"];
global.servers = {};
bot.setMaxListeners(0);


function checkServer(message) 
{
    if (!servers[message.guild.id]) servers[message.guild.id] = {
        queue: [],
        dispathcher: [],
        loop: false,
        connection: [],
        playing: true,
        volume: 5,
        language: "dev"
    }
}

bot.login(token);