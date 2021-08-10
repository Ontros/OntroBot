import { Message, VoiceConnection } from 'discord.js';
import { ReactionFormOption, Song } from '../../types';

module.exports = {
    commands: ['search'],
    expectedArgs: '<song name>',
    permissionError: '',
    minArgs: 1,
    maxArgs: null,
    callback: async (message: Message, args: string[], text: string) => {
        const { bot, lang } = global
        if (!message.guild) { return; }
        function play(connection: VoiceConnection, message: Message) {
            if (!message.guild) { return }
            var server = global.servers[message.guild.id];
            const { YTDL } = global;
            server.playing = true;
            server.dispathcher = connection.play(YTDL(
                server.loop === 2 ? server.queue[Math.floor(Math.random() * (server.queue.length) + 1) - 1].url :
                    server.queue[0].url, { filter: "audioonly" }));
            server.connection = connection;
            server.dispathcher.setVolume(server.volume / 100);

            server.dispathcher.on("finish", function () {
                if (!server.queue[1]) {
                    server.playing = false;
                    server.queue = []
                    connection.disconnect();
                    return
                }
                if (server.loop === 0) {
                    server.queue.shift();
                }
                else if (server.loop === 1) {
                    //move song to end of queue
                    var oldSong: any = server.queue.shift();
                    server.queue.push(oldSong);
                }
                play(connection, message);
            });
            server.dispathcher.on("error", function (Error: Error) {
                console.log(Error)
                console.log("dispatcher error");
            });
        }

        async function FindVideo(url: string, message: Message) {
            const { YouTube } = global;
            type Video = {
                title: string;
                id: string;
                channel: {
                    title: string;
                }
            }
            var videos: Video[] = await YouTube.searchVideos(url, 10);
            var callbacks: ReactionFormOption[] = []

            videos.forEach(video => {
                if (!message.guild) { return; }
                callbacks.push({ callback: null, title: `${video.title} ${lang(message.guild.id, 'BY')} ${video.channel.title}` })
            })

            var output = await global.reactionForm(message, null, 'Search', 'What song do you want to play?', callbacks);
            //console.log(videos)
            //output.botMessage.delete()
            var video = await YouTube.getVideoByID(videos[output.id].id);

            var song: Song =
            {
                title: video.title,
                id: video.id,
                url: 'https://www.youtube.com/watch?v=' + video.id,
                requestedBy: message.author.username,
                duration: video.duration
            }
            return song;


            /*try 
            {
                var video = await YouTube.getVideo(url);
            }
            catch 
            {
                var videos = await YouTube.searchVideos(url, 1);
                var video = await YouTube.getVideoByID(videos[0].id);
            }

            var song: Song = 
            {
                title: video.title,
                id: video.id,  
                url: 'https://www.youtube.com/watch?v='+video.id,
                requestedBy: message.author.username 
            }
            //console.log(args[0]);
            return song;*/
        }
        if (!message.guild) { return }
        var server = global.servers[message.guild.id];
        //nalezeni videa
        FindVideo(text, message)
            .then(song => {
                if (!message.guild) { return }
                global.servers[message.guild.id].queue.push(song);
                //if(!message.guild.voiceStates.connection) message.member.voice.channel.join().then(function(connection){

                if (server.queue.length > 1) {
                    //songa přidána do queue, už hraje bot
                    message.channel.send(lang(message.guild.id, 'QUEUE_ADD'));
                }
                else {
                    if (!message.member?.voice.channel) {
                        message.channel.send(lang(message.guild.id, 'NOT_IN_VC'));
                        global.bot.channels.fetch
                        return;
                    }
                    message.member.voice.channel.join()
                        .then(function (connection: VoiceConnection) {
                            if (!message.guild) { return }
                            play(connection, message);
                            message.channel.send(lang(message.guild.id, 'PLAY_START'));
                        }).catch((err: Error) => console.log(err));
                }
            })
            .catch(err => console.log(err));

    },
    permissions: [],
    requiredRoles: [],
    allowedIDs: [],
}