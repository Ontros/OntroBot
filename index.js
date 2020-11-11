const Discord = require('discord.js');
const bot = new Discord.Client();
const YTDL = require('ytdl-core');
const youtube = require('simple-youtube-api');
const fs = require('fs');
const { Console } = require('console');

const token = 'NjEwODMwNjYyMzUzNjgyNDY0.XVK-jA.XrOAP-1zgiOwdkg2euZNqDUUS0o';
const YouTube = new youtube("AIzaSyCk5cemAA5LpoUwpgiN8dDxw_ERge2EedI");

bot.on('ready', () => {
    console.log('This bot is online!')
})

const PREFIX = '_';
const OwnerID = '255345748441432064';
const LanguageList = ["dev", "eng", "czk"];
global.servers = {};

bot.on('message', message=>{
    
    if (message.content.substring(0,1) == '_') 
    {
        let args = message.content.substring(PREFIX.length).split(" ");
        checkServer(message);
        switch (args[0]) 
        {
            case 'ping':
                message.reply('pong!');
            break;

            case 'play':

                function play(connection, message){
                    

                    var server = servers[message.guild.id];

                    server.playing = true;
                    server.dispathcher = connection.play(YTDL(server.queue[0].url, {filter: "audioonly"}))
                    server.connection = connection;
                    server.dispathcher.setVolume(server.volume/100);

                    server.dispathcher.on("finish", function(){
                        if (!server.loop)
                            server.queue.shift();
                        if(server.queue[0]) {
                            play(connection, message);
                        } else {
                            server.connection = "";
                            server.playing = false;
                            connection.disconnect();
                        }
                    });
                }

                async function FindVideo(url, message) {
                    try 
                    {
                        var video = await YouTube.getVideo(args[1]);
                    }
                    catch 
                    {
                        var videos = await YouTube.searchVideos(args[1], 1);
                        var video = await YouTube.getVideoByID(videos[0].id);
                    }

                    song = 
                    {
                        title: video.title,
                        id: video.id,  
                        url: 'https://www.youtube.com/watch?v='+video.id,
                        requestedBy: message.author.username 
                    }
                    return song;
                }

                if (!args[1]) {
                    say("No link", message);
                    return;
                }

                if (!message.member.voice.channel) {
                    say("Join-NoChannel", message);
                    return;
                }

                var server = servers[message.guild.id];

                //nalezeni videa
                song = FindVideo(message.content.substring(5), message)
                .then(song =>{
                    servers[message.guild.id].queue.push(song);
                    //if(!message.guild.voiceStates.connection) message.member.voice.channel.join().then(function(connection){

                    if (server.queue.length > 1) 
                    {
                        //songa přidána do queue, už hraje bot
                        say("Queue add", message);
                    }
                    else
                    {
                        message.member.voice.channel.join()
                        .then(function(connection){
                            say("Start playing", message);
                            play(connection,message);
                        })
                    }
                })
                .catch();
                //say("Song not found", message)
            break;

            case 'skip':
                server = servers[message.guild.id]
                server.dispathcher.end();
                say("Song skipped", message);
            break;

            case 'stop':
                var server = servers[message.guild.id];
                //console.log(message.guild.voice.connection);
                if (message.guild.voice.connection){
                    for (var i = server.queue.length -1; i >= 0; i--) {
                        server.queue.splice(i, 1);
                    }
                    server.dispathcher.end();
                    say("Stop", message);
                }
                else {
                    say("Error", message);
                }
            break;

            case 'queue':
                var server = servers[message.guild.id];
                if (!server.queue) 
                {
                    say("Nothing playing", message);
                }
                else 
                {
                    say("Queue", message);
                }
            break;

            case 'test':
                if (message.author.id == OwnerID) 
                {
                    //console.log(servers[message.guild.id].connection.channel);
                    //message.author.send("LMAO");
                    //bot.users.cache.find(u => u.tag === args[1]).send(args[2]);
                    //bot.fetchUser(args[1]).send(args[2]);
                    message.guild.members.cache.get(args[1]).send(args[2]);
                }
                else
                {
                    message.reply("Co zkůšáš ty debílku! :angry:");
                }
            break;

            case 'penys':
                if (message.author.username.toLowerCase().includes("ontro"))
                {
                    message.reply("Velikost tvojeho penysu je: 420 cm");
                }
                else if (message.author.username.toLowerCase().includes("tyfonek")) 
                {
                    message.reply("Velikost tvojeho penysu je: "+(Math.random()*-10).toString() + " cm");
                }
                else
                {
                    message.reply("Velikost tvojeho penysu je: " + (Math.random()*5).toString() + " cm");
                }
            break;

            case 'loop':
                var server = servers[message.guild.id];
                if (!server.loop) {
                    message.reply("Loopinguju");
                    server.loop = true;
                }
                else 
                {
                    message.reply("Přestávám loopingovat");
                    server.loop = false;
                }
            break;   
             
            case 'volume':
                var server = servers[message.guild.id];
                if (!server.queue) 
                {
                    message.reply('Nic nehraje debílku! :angry:')
                }
                else if (!args[1])
                {
                    message.reply('Aktuální hlasitost je: '+ server.volume + '%')
                }
                else 
                {
                    server.volume = args[1]
                    server.dispathcher.setVolume(server.volume / 100);
                    message.reply('Hlasitost nastavena na: '+server.volume+ '%')
                }
            break;

            case 'ok':
                message.reply("WTF?!");
            break;

            case 'lmao?':
                message.reply("lmao!");
            break; 

            case 'PENYS':
                if (!message.author.bot) 
                {
                message.channel.send("_PENYS");
                }
            break;

            case 'WeebsOUT':
                message.channel.send("TRŮ!");
                break;

            case 'gay':
                message.reply("NO U!")
            break;

            case 'help':
                var helpMessage = "";
                helpMessage += "1. _ping" + '\n';
                helpMessage += "2. _play" + '\n';
                helpMessage += "3. _skip" + '\n';
                helpMessage += "4. _stop" + '\n';
                helpMessage += "5. _queue" + '\n';
                helpMessage += "6. _volume" + '\n';
                helpMessage += "7. _loop" + '\n';
                message.channel.send(helpMessage);
            break;

            case 'language':
                if (args[1]) 
                {
                    servers[message.guild.id].language = args[1];
                }
                else 
                {
                    say("No-Language", message);
                }
                //console.log(servers);
                //saveLanguage(servers);
            break;
        }
    }
});

function say(type, message) 
{
    var server = servers[message.guild.id];
    switch (type) 
    {
        case 'No link':
            
            switch (server.language) 
            {
                case 'dev':
                    message.channel.send("Nezadal jsi link debílku!");
                break;
                default:
                    message.reply("This message is not available for your language!");
                break;
            }
        break;

        case 'Queue add':
            switch (server.language) 
            {
                case 'dev':
                    message.reply("Přidal jsem songu do queue");
                break;
                default:
                    message.reply("This message is not available for your language!");
                break;
            }
        break;

        case 'Song not found':
            switch (server.language) 
            {
                case 'dev':
                    message.reply("Songa nenalezena");
                break;
                default:
                    message.reply("This message is not available for your language!");
                break;
            }
        break;

        case 'Song skipped':
            switch (server.language) 
            {
                case 'dev':
                    message.reply('Úspěšně překočeno! :play_pause:');
                break;
                default:
                    message.reply("This message is not available for your language!");
                break;
            }
        break;

        case 'Nothing playing':
            switch (server.language) 
            {
                case 'dev':
                    message.reply('Nic nehraje debílku! :angry:');
                break;
                default:
                    message.reply("This message is not available for your language!");
                break;
            }
        break;

        case 'Queue':
            switch (server.language) 
            {
                case 'dev':
                    //message.channel.send('Song queue:');
                    //var i = 1;
                    //var zprava = "";
                    //server.queue.forEach(song => {
                        //if (i == 1) 
                        //{
                            //zprava += (i+'. '+song.title + " (nyní hrající)\n");
                        //}
                        //else 
                        //{
                            //zprava += (i+'. '+song.title+"\n");
                        //}
                        //i++;
                    //});
                    var i = 1;
                    const exampleEmbed = new Discord.MessageEmbed()
	                    .setColor('#0099ff')
	                    .setTitle('Queue')
	                    .setThumbnail(bot.user.avatar_url);
                    server.queue.forEach(song => {
                        exampleEmbed.addField(i + '. [' + song.title + '](' + song.url + ')', 'Requested by: '+song.requestedBy);
                        i++;
                    });
                        
                    exampleEmbed.setImage(bot.user.avatar_url)
	                    .setTimestamp()
	                    .setFooter('Queue list requested by: '+message.author.username, message.author.avatarURL());
                    message.channel.send(exampleEmbed);
                break;
                default:
                    message.reply("This message is not available for your language!");
                break;
            }
        break;

        case 'Stop':
            switch (server.language) 
            {
                case 'dev':
                    message.reply('Když na tom tak trváš tak přestávám hrát :angry:');
                break;
                default:
                    message.reply("This message is not available for your language!");
                break;
            }
        break;

        case 'Join-NoChannel':
            switch (server.language) 
            {
                case 'dev':
                    message.channel.send("Musíš být v kanalizaci, abych mohl přidrandit!");
                break;
                default:
                    message.reply("This message is not available for your language!");
                break;
            }
        break;

        case 'Stop-NoChannel':
            switch (server.language) 
            {
                case 'dev':
                    message.channel.send("Musím vůbec hrát, abych mohl!");
                break;
                default:
                    message.reply("This message is not available for your language!");
                break;
            }
        break;

        case 'Start playing':
            switch (server.language) 
            {
                case 'dev':
                    message.channel.send("Začínám hrát!");
                break;
                default:
                    message.reply("This message is not available for your language!");
                break;
            }
        break;

        case 'No-Language':
            switch (server.language) 
            {
                case 'dev':
                    message.channel.send("Musíš zadat jazyk! DEBÍLKU");
                break;
                default:
                    message.reply("This message is not available for your language!");
                break;
            }
        break;

        default:
            try 
            {
                switch (server.language) 
                {
                    case 'dev':
                        message.channel.send("Chybenzí OU NOU!");
                    break;
                    default:
                        message.reply("An unexpected error has occured!");
                    break;
                }
            }
            catch 
            {
                message.reply('An unexpected error has occured!')
            }
        break;
            
        //default:
        //    message.reply("Message couln´t be found");
        //break;
    }
}

function saveLanguage(serversz) 
{
    var txt = "";
    var serversa = serversz;
    serversa.forEach(function(item, index, array) {
        txt += item.language + "," + index + ";";
    });
    
    fs.writeFile('languages.txt', txt, function (err,data) {
        if (err) {
          return console.log(err);
        }
        console.log(data);
    });
}

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