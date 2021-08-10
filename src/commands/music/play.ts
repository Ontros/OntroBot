import console from "console";
import { Message, VoiceConnection } from "discord.js";
import { Song } from "../../types";

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
        function play(connection: VoiceConnection, message: Message) {
            if (!message.guild) { return }
            var server = global.servers[message.guild.id];
            const { YTDL } = global;
            server.playing = true;
            //here crash fix plz
            //console.log(server.queue)
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
                if (!message.guild) { return }
                message.channel.send(lang(message.guild.id, 'UNKWN_ERR_HALT'))
            });
        }

        async function FindVideo(url: string, message: Message) {
            //console.log(`looking for ${url}`)
            const { YouTube } = global;
            try {
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
                url: 'https://www.youtube.com/watch?v=' + video.id,
                requestedBy: message.author.username,
                duration: video.duration
            }
            return song;
        }
        if (!message.guild) { return }
        var server = global.servers[message.guild.id];
        const { lang } = global;
        //nalezeni videa
        var videoNames = [text]
        var matchPlaylist = text.match(/^(https:\/\/open.spotify.com\/playlist\/|https:\/\/open.spotify.com\/user\/spotify\/playlist\/|spotify:user:spotify:playlist:)(?<url>[a-zA-Z0-9]+)(.*)$/)
        var matchTrack = text.match(/^(https:\/\/open.spotify.com\/track\/|spotify:user:spotify:track:)(?<url>[a-zA-Z0-9]+)(.*)$/)
        var matchAlbum = text.match(/^(https:\/\/open.spotify.com\/album\/|spotify:user:spotify:album:)(?<url>[a-zA-Z0-9]+)(.*)$/)
        if (matchPlaylist || matchTrack || matchAlbum) {
            // if (false) {
            message.channel.send(lang(message.guild.id, 'SPOTIFY_NO_SUPPORT'))
            return
            // //setting up spot to yt
            // const clients = global.SPOTIFY_CLIENT.split(':')
            // const spotifyApi = new global.SpotifyWebApi({
            //     clientId: clients[0],
            //     clientSecret: clients[1],
            //     redirectUri: 'http://www.example.com/callback'
            // })
            // const refreshed = await global.fetch("https://accounts.spotify.com/api/token", {
            //     body: "grant_type=refresh_token&refresh_token=" + global.SPOTIFY_OAUTH,
            //     headers: {
            //         Authorization: "Basic " + new Buffer(global.SPOTIFY_CLIENT).toString('base64'),
            //         "Content-Type": "application/x-www-form-urlencoded"
            //     },
            //     method: "POST"
            // })
            // var ans = await refreshed.json();
            // spotifyApi.setAccessToken(ans.access_token)
            // const spotifyToYoutube = global.SpotifyToYoutube(spotifyApi)
            // videoNames = []
            // //@ts-expect-error
            //var botMessage = await message.channel.send(global.createEmbed(message, lang(message.guild.id, 'FINDING_MUSIC'), lang(message.guild.id, 'QUER_SPOTIFY'), []))

            // //PLAYLIST
            // if (matchPlaylist) {
            //     //@ts-expect-error
            //     var playlists = await global.fetch("https://api.spotify.com/v1/playlists/" + matchPlaylist.groups?.url, {
            //         headers: {
            //             Accept: "application/json",
            //             Authorization: "Bearer " + ans.access_token,
            //             "Content-Type": "application/json"
            //         }
            //     })
            //     var playlist = await playlists.json();
            //     var i = 0;
            //     var length = playlist.tracks.items.length
            //     var lastStamp = Date.now()
            //     await Promise.all(playlist.tracks.items.map(async (track: any, index: number) => {
            //         var id: string = track.track.id
            //         var youtubeID = await spotifyToYoutube(id).catch((err: Error) => { console.log(err) })
            //         videoNames[index] = youtubeID
            //         i++
            //         if (Date.now() - lastStamp > 500) {
            //             if (!message.guild) { return }
            //             var embed = global.progressBar(message, lang(message.guild.id, 'FINDING_MUSIC'), lang(message.guild.id, `QUER_SPOTIFY`) + `\n${i}/${length}`, i / length)
            //             botMessage.fetch().catch(async () => { botMessage = await message.channel.send(embed) })
            //             botMessage.edit(embed)
            //             lastStamp = Date.now()
            //         }
            //     }))
            // }

            // //ALBUM
            // if (matchAlbum) {
            //     //@ts-expect-error
            //     var albums = await global.fetch("https://api.spotify.com/v1/albums/" + matchAlbum.groups?.url, {
            //         headers: {
            //             Accept: "application/json",
            //             Authorization: "Bearer " + ans.access_token,
            //             "Content-Type": "application/json"
            //         }
            //     })
            //     var album = await albums.json();
            //     var i = 0;
            //     var length = album.tracks.items.length
            //     var lastStamp = Date.now()
            //     await Promise.all(album.tracks.items.map(async (track: any, index: number) => {
            //         var id: string = track.id
            //         var youtubeID = await spotifyToYoutube(id)
            //         videoNames[index] = youtubeID
            //         i++
            //         if (Date.now() - lastStamp > 500) {
            //             if (!message.guild) { return }
            //             var embed = global.progressBar(message, lang(message.guild.id, 'FINDING_MUSIC'), lang(message.guild.id, 'QUER_SPOTIFY') + `\n${i}/${length}`, i / length)
            //             botMessage.fetch().catch(async () => { botMessage = await message.channel.send(embed) })
            //             botMessage.edit(embed)
            //             lastStamp = Date.now()
            //         }
            //     }))
            // }

            // //TRACK
            // if (matchTrack) {
            //     //@ts-expect-error
            //     var tracks = await global.fetch("https://api.spotify.com/v1/tracks/" + matchTrack.groups?.url, {
            //         headers: {
            //             Accept: "application/json",
            //             Authorization: "Bearer " + ans.access_token,
            //             "Content-Type": "application/json"
            //         }
            //     })
            //     var track = await tracks.json();
            //     videoNames[0] = await spotifyToYoutube(track.id)
            // }
        }
        var startingLength = global.servers[message.guild.id].queue.length
        var ij = 0
        var lastStamp = Date.now()

        Promise.all(videoNames.map(async (name: any, i: number) => {
            // FindVideo((matchPlaylist || matchTrack || matchAlbum) ? `https://www.youtube.com/watch?v=${name}` : name, message)
            FindVideo(name, message)
                .then(song => {
                    if (!message.guild) { return }
                    global.servers[message.guild.id].queue[startingLength + i] = song;
                    ij++

                    if ((videoNames.length === 1 && server.queue.length > 2) || (videoNames.length > 1 && i !== 1)) {
                        //songa přidána do queue, už hraje bot
                        console.log('play.ts 195 error!! (asi snaha o spotify)')
                        // if (Date.now() - lastStamp > 500 && botMessage) {
                        //     var embed = global.progressBar(message, lang(message.guild.id, 'FINDING_MUSIC'), lang(message.guild.id, 'QUER_YT') +
                        //         `\n ${ij}/${videoNames.length}`, ij / videoNames.length)
                        //     botMessage.fetch().catch(async () => { botMessage = await message.channel.send(embed) })
                        //     botMessage.edit(embed)
                        //     lastStamp = Date.now()
                        // }
                        // if (ij === videoNames.length) {
                        //     var del = true
                        //     if (botMessage) {
                        //         botMessage.fetch().catch(() => { del = false })
                        //         if (del) {
                        //             botMessage.delete()
                        //         }
                        //     }
                        // }
                    }
                    else {
                        if (!message.member?.voice.channel) {
                            message.channel.send(lang(message.guild.id, 'NOT_IN_VC'));
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
        }))
    }
}

function sleep(ms: number) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}