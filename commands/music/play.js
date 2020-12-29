const YTDL = require('ytdl-core');
const youtube = require('simple-youtube-api');
const YouTube = new youtube(process.env.YT_TOKEN);

module.exports = {
    commands: ['play', 'p'],
    expectedArgs: '<url>',
    minArgs: 1,
    maxArgs: 1,
    permissions: [],
    requiredRoles: [],
    allowedIDs: [],
    requireChannelPerms: true,
    callback: (message, args, text) => {
        function play(connection, message){
            var server = servers[message.guild.id];

            server.playing = true;
            server.dispathcher = connection.play(YTDL(server.queue[0].url, {filter: "audioonly"}));
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
            server.dispathcher.on("error", function() {
                
                console.log("dispatcher error");
            });
        }

        async function FindVideo(url, message) {
            try 
            {
                var video = await YouTube.getVideo(args[0]);
            }
            catch 
            {
                var videos = await YouTube.searchVideos(args[0], 1);
                var video = await YouTube.getVideoByID(videos[0].id);
            }

            song = 
            {
                title: video.title,
                id: video.id,  
                url: 'https://www.youtube.com/watch?v='+video.id,
                requestedBy: message.author.username 
            }
            //console.log(args[0]);
            return song;
        }

        //if (!args[0]) {
        //    message.channel.send("Nezadal jsi link debílku!");
        //    return;
        //}

        //if (!message.member.voice.channel) {
        //    message.channel.send("Musíš být v kanalizaci, abych mohl přidrandit!");
        //    return;
        //}

        var server = servers[message.guild.id];

        //nalezeni videa
        song = FindVideo(message.content.substring(5), message)
        .then(song =>{
            servers[message.guild.id].queue.push(song);
            //if(!message.guild.voiceStates.connection) message.member.voice.channel.join().then(function(connection){

            if (server.queue.length > 1) 
            {
                //songa přidána do queue, už hraje bot
                message.channel.send(lang(message.guild.id, 'QUEUE_ADD'));
            }
            else
            {
                message.member.voice.channel.join()
                .then(function(connection){
                    play(connection,message);
                    message.channel.send(lang(message.guild.id, 'PLAY_START'));
                }).catch(err => console.log(err));
            }
        })
        .catch(err => console.log(err));
    }
}