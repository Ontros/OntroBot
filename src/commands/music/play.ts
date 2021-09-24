import console from "console";
import { EmbedField, Message, VoiceConnection } from "discord.js";
import { Song, Video } from "../../types";
import getPlaylistByName from '../../utils/getPlaylistByName'

module.exports = {
    commands: ['play', 'p'],
    expectedArgs: '<url>',
    minArgs: 1,
    maxArgs: null,
    permissions: [],
    requiredRoles: [],
    allowedIDs: [],
    requireChannelPerms: true,
    callback: async (message: Message, args: string[], text: string) => {
        async function play(connection: VoiceConnection, message: Message) {
            if (!message.guild) { return }
            var server = global.servers[message.guild.id];
            const { YTDL } = global;
            server.playing = true;
            //here crash fix plz
            //console.log(server.queue)
            var newSongIndex = server.loop === 2 ? Math.floor(Math.random() * (server.queue.length) + 1) - 1 : 0
            var newSong = server.queue[newSongIndex]
            if (!newSong.duration) {
                newSong = await FindVideo(newSong.id, message, true)
                server.queue[newSongIndex] = newSong
            }
            server.dispathcher = await connection.play(YTDL(newSong.url, { filter: "audioonly" }));
            server.connection = connection;
            server.dispathcher.setVolume(server.volume / 100);

            server.dispathcher.on("finish", async function () {
                console.log('play finish')
                if (!server.queue[1] && server.loop !== 3) {
                    //KONEC
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
                await play(connection, message);
            });
            server.dispathcher.on("error", function (Error: Error) {
                console.log(Error)
                console.log("dispatcher error");
                if (!message.guild) { return }
                message.channel.send(lang(message.guild.id, 'UNKWN_ERR_HALT'))
            });
        }

        async function FindVideo(url: string, message: Message, isID?: boolean): Promise<Song> {
            isID = isID ? true : false
            console.log(`looking for ${url}`)
            const { YouTube } = global;
            if (isID) {
                var video = await YouTube.getVideoByID(url)
            }
            else {

                try {
                    var video = await YouTube.getVideo(url);
                }
                catch
                {
                    console.log('play searching - spotify debug - todo delete')
                    var videos = await YouTube.searchVideos(url, 1);
                    var video = await YouTube.getVideoByID(videos[0].id);
                }
            }

            var song: Song =
            {
                title: video.title,
                id: video.id,
                url: 'https://www.youtube.com/watch?v=' + video.id,
                requestedBy: message.author.username,
                duration: video.duration
            }
            return song;
        }
        if (!message.guild) { return }
        var server = global.servers[message.guild.id];
        const { lang } = global;
        var videoName = text
        var startingLength = global.servers[message.guild.id].queue.length
        var matchPlaylist = text.match(/^(https:\/\/open.spotify.com\/playlist\/|https:\/\/open.spotify.com\/user\/spotify\/playlist\/|spotify:user:spotify:playlist:)(?<url>[a-zA-Z0-9]+)(.*)$/)
        var matchTrack = text.match(/^(https:\/\/open.spotify.com\/track\/|spotify:user:spotify:track:)(?<url>[a-zA-Z0-9]+)(.*)$/)
        var matchAlbum = text.match(/^(https:\/\/open.spotify.com\/album\/|spotify:user:spotify:album:)(?<url>[a-zA-Z0-9]+)(.*)$/)
        var songs: Video[] = []
        if (matchPlaylist || matchTrack || matchAlbum) {
            message.channel.send(lang(message.guild.id, 'SPOTIFY_NO_SUPPORT'))
        }
        if (args[0] === 'list') {
            //TODO: tansalate
            if (!args[1]) {
                var fields: (EmbedField[] | undefined) = global.servers[message.guild.id].playlists?.map((playlist) => {
                    return { name: playlist.name, inline: false, value: `${playlist.videos.length} songs` }
                })
                if (!fields) {
                    throw new Error("play.ts list fiels error")
                    return
                }

                message.channel.send(global.createEmbed(message, 'List of Playlists',
                    'For more details visit my webiste: <websiste link>', fields
                ))
            }
            else {
                var newPlaylist = getPlaylistByName(message.guild.id, args[1])
                if (!newPlaylist) {
                    message.channel.send("Playlist not found")
                    return
                }
                else {
                    //videoNames = newPlaylist.videos.map((video) => { return video.id })//global.servers[message.guild.id].playlists
                    songs = newPlaylist.videos
                }
            }

        }
        var ij = 0
        // var lastStamp = Date.now()
        //TODO: plan to code
        //pokud nehraje tak join a pridat do queue
        //pokud hraje tak pridat do queue



        if (!message.guild) { return }

        var playing = server.queue.length > 1
        if (songs) {
            var videos: Song[] = songs.map((song: Video) => { return { title: song.title, id: song.id, url: 'https://www.youtube.com/watch?v=' + song.id, requestedBy: message.author.username, duration: undefined } })
            global.servers[message.guild.id].queue = [...global.servers[message.guild.id].queue, ...videos]
        }
        else {
            var video = await FindVideo(videoName, message)
            global.servers[message.guild.id].queue.push(video)
        }


        if (!message.member?.voice.channel) {
            message.channel.send(lang(message.guild.id, 'NOT_IN_VC'));
            return;
        }
        if (playing) {
            message.channel.send(lang(message.guild.id, 'QUEUE_ADD'))
        }
        else {
            message.member.voice.channel.join()
                .then(function (connection: VoiceConnection) {
                    if (!message.guild) { return }
                    play(connection, message);
                    message.channel.send(lang(message.guild.id, 'PLAY_START'));
                }).catch((err: Error) => console.log(err));
        }

    }
}

function sleep(ms: number) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}
    //     if (Date.now() - lastStamp > 500 && botMessage) {
    //         var embed = global.progressBar(message, lang(message.guild.id, 'FINDING_MUSIC'), lang(message.guild.id, 'QUER_YT') +
    //             `\n ${ij}/${videoNames.length}`, ij / videoNames.length)
    //         botMessage.fetch().catch(async () => { botMessage = await message.channel.send(embed) })
    //         botMessage.edit(embed)
    //         lastStamp = Date.now()
    //     }
    //     if (ij === videoNames.length) {
    //         var del = true
    //         if (botMessage) {
    //             botMessage.fetch().catch(() => { del = false })
    //             if (del) {
    //                 botMessage.delete()
    //             }
    //         }
    //     }