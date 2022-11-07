import console from "console";
import { EmbedField, Message, } from "discord.js";
import { Song, Video } from "../../types";
import getPlaylistByName from '../../utils/getPlaylistByName'
import { exec as ytdlexec } from 'youtube-dl-exec';
import { createAudioPlayer, createAudioResource, DiscordGatewayAdapterCreator, joinVoiceChannel, NoSubscriberBehavior, VoiceConnection } from "@discordjs/voice";
const playDL = require('play-dl')
// import 'play-dl'

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
            try {

                if (!message.guild) { return }
                var server = global.servers[message.guild.id];
                // const { YTDL } = global;
                // const YTDL = play
                // const YTDL = ytdlexec
                server.playing = true;
                //here crash fix plz
                //console.log(server.queue)
                var newSongIndex = server.loop === 2 ? Math.floor(Math.random() * (server.queue.length) + 1) - 1 : 0
                var newSong: Song = server.queue[newSongIndex]
                if (!newSong.duration) {
                    //@ts-ignore
                    newSong = await FindVideo(newSong.id, message, true)
                    server.queue[newSongIndex] = newSong
                }

                // server.dispathcher = await connection.play(YTDL(newSong.url, { filter: "audioonly" }));
                // const stream = YTDL(newSong.url, { filter: "audioonly" });
                // const stream = YTDL(
                //     newSong.url, {
                //     output: "-",
                //     format: "bestaudio[ext=webm+acodec=opus+tbr>100]/bestaudio[ext=webm+acodec=opus]/bestaudio/best",
                //     limitRate: '1M',
                //     rmCacheDir: true,
                //     verbose: true
                // }, { stdio: ['ignore', 'pipe', 'ignore'] }).then((stream) => {
                //     // const audioResource = createAudioResource(stream.stdout!)
                //     // server.dispathcher = connection.play(audioResource)

                const stream = await playDL.stream(newSong.url)
                // })
                // console.log("stream")
                // return
                const audioResource = createAudioResource(stream.stream, { inputType: stream.type })
                const player = createAudioPlayer({ behaviors: { noSubscriber: NoSubscriberBehavior.Play } })
                server.audioResource = audioResource
                server.player = player
                player.play(audioResource)
                // server.dispathcher = connection.play(audioResource.playStream)
                server.dispathcher = connection.subscribe(player)
                server.connection = connection;
                audioResource.volume?.setVolume(server.volume / 100)
                server.player.on("stateChange", async function (oldState, newState) {
                    if (newState.status !== "idle") {
                        return
                    }
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
                server.player.on("error", function (Error: Error) {
                    console.log(Error)
                    console.log("dispatcher error");
                    if (!message.guild) { return }
                    message.channel.send(lang(message.guild.id, 'UNKWN_ERR'))
                });

            }
            catch (e) {
                console.log(e)
            }
        }

        async function FindVideo(url: string, message: Message, isID?: boolean): Promise<Song[]> {
            return new Promise(async (resolve) => {
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
                        try {
                            var playlist = await YouTube.getPlaylist(url)
                            var videos = await playlist.getVideos()

                        }
                        catch {
                            var videos = await YouTube.searchVideos(url, 1);
                            var video = await YouTube.getVideoByID(videos[0].id);
                        }
                    }
                }
                if (videos) {
                    resolve(videos.map((vid: any) => {
                        return {
                            title: vid.title,
                            id: vid.id,
                            url: 'https://www.youtube.com/watch?v=' + vid.id,
                            requestedBy: message.author.username,
                            duration: vid.duration
                        }
                    }))
                }
                else {
                    resolve(video)
                }
            })
        }
        if (!message.guild) { return }
        var server = global.servers[message.guild.id];
        const { lang } = global;
        var videoName = text
        // var startingLength = global.servers[message.guild.id].queue.length
        var matchPlaylist = text.match(/^(https:\/\/open.spotify.com\/playlist\/|https:\/\/open.spotify.com\/user\/spotify\/playlist\/|spotify:user:spotify:playlist:)(?<url>[a-zA-Z0-9]+)(.*)$/)
        var matchTrack = text.match(/^(https:\/\/open.spotify.com\/track\/|spotify:user:spotify:track:)(?<url>[a-zA-Z0-9]+)(.*)$/)
        var matchAlbum = text.match(/^(https:\/\/open.spotify.com\/album\/|spotify:user:spotify:album:)(?<url>[a-zA-Z0-9]+)(.*)$/)
        var songs: Video[] = []
        if (matchPlaylist || matchTrack || matchAlbum) {
            message.channel.send(lang(message.guild.id, 'SPOTIFY_NO_SUPPORT'))
        }
        // if (args[0] === 'list') {
        //     //TODO: tansalate
        //     if (!args[1]) {
        //         var fields: (EmbedField[] | undefined) = global.servers[message.guild.id].playlists?.map((playlist) => {
        //             return { name: playlist.name, inline: false, value: `${playlist.videos.length} songs` }
        //         })
        //         if (!fields) {
        //             throw new Error("play.ts list fiels error")
        //             return
        //         }

        //         message.channel.send(global.createEmbed(message, 'List of Playlists',
        //             'For more details visit my webiste: <websiste link>', fields
        //         ))
        //     }
        //     else {
        //         var newPlaylist = getPlaylistByName(message.guild.id, args[1])
        //         if (!newPlaylist) {
        //             message.channel.send("Playlist not found")
        //             return
        //         }
        //         else {
        //             //videoNames = newPlaylist.videos.map((video) => { return video.id })//global.servers[message.guild.id].playlists
        //             songs = newPlaylist.videos
        //         }
        //     }

        // }
        // var ij = 0
        // var lastStamp = Date.now()
        //TODO: plan to code
        //pokud nehraje tak join a pridat do queue
        //pokud hraje tak pridat do queue



        if (!message.guild) { return }

        var playing = server.queue.length > 1
        if (songs.length > 0) {
            var videos: Song[] = songs.map((song: Video) => { return { title: song.title, id: song.id, url: 'https://www.youtube.com/watch?v=' + song.id, requestedBy: message.author.username, duration: undefined } })
            global.servers[message.guild.id].queue = [...global.servers[message.guild.id].queue, ...videos]
        }
        else {
            var video = await FindVideo(videoName, message)
            for (var vid of video) {
                global.servers[message.guild.id].queue.push(vid)
            }
        }
        if (!message.member?.voice.channel) {
            message.channel.send(lang(message.guild.id, 'NOT_IN_VC'));
            return;
        }
        if (playing) {
            message.channel.send(lang(message.guild.id, 'QUEUE_ADD'))
        }
        else {
            const connection = joinVoiceChannel({
                channelId: message.member.voice.channel.id,
                guildId: message.guild.id,
                adapterCreator: message.guild.voiceAdapterCreator
            })
            play(connection, message);
            message.channel.send(lang(message.guild.id, 'PLAY_START'));
            // message.member.voice.channel.join()
            //     .then(function (connection: VoiceConnection) {
            //         if (!message.guild) { return }
            //         play(connection, message);
            //         message.channel.send(lang(message.guild.id, 'PLAY_START'));
            //     }).catch((err: Error) => console.log(err));
        }

    }
}

// function sleep(ms: number) {
//     return new Promise((resolve) => {
//         setTimeout(resolve, ms);
//     });
// }
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