import { Message } from 'discord.js';
import { Playlist, Video } from '../../types';
//import fs from 'fs'

module.exports = {
    commands: ['convert'],
    expectedArgs: '<url> <name>',
    permissionError: '',
    minArgs: 2,
    maxArgs: 2,
    callback: async (message: Message, args: string[], text: string) => {
        const { bot, lang } = global
        if (!message.guild) { return; }


        //nalezeni videa
        var videoNames = []
        var spotifyUrl = args.shift()
        if (!spotifyUrl) {
            throw Error("WTF convert.ts")
        }
        //var spotifyUrl = args[0]
        var matchPlaylist = spotifyUrl.match(/^(https:\/\/open.spotify.com\/playlist\/|https:\/\/open.spotify.com\/user\/spotify\/playlist\/|spotify:user:spotify:playlist:)(?<url>[a-zA-Z0-9]+)(.*)$/)
        var matchTrack = spotifyUrl.match(/^(https:\/\/open.spotify.com\/track\/|spotify:user:spotify:track:)(?<url>[a-zA-Z0-9]+)(.*)$/)
        var matchAlbum = spotifyUrl.match(/^(https:\/\/open.spotify.com\/album\/|spotify:user:spotify:album:)(?<url>[a-zA-Z0-9]+)(.*)$/)
        var matchArtist = spotifyUrl.match(/^(https:\/\/open.spotify.com\/artist\/|spotify:user:spotify:album:)(?<url>[a-zA-Z0-9]+)(.*)$/)
        if (matchPlaylist || matchTrack || matchAlbum || matchArtist) {
            // if (false) {
            //setting up spot to yt
            const clients = global.SPOTIFY_CLIENT.split(':')
            const spotifyApi = new global.SpotifyWebApi({
                clientId: clients[0],
                clientSecret: clients[1],
                redirectUri: 'http://www.example.com/callback'
            })
            const refreshed = await global.fetch("https://accounts.spotify.com/api/token", {
                body: "grant_type=refresh_token&refresh_token=" + global.SPOTIFY_OAUTH,
                headers: {
                    Authorization: "Basic " + new Buffer(global.SPOTIFY_CLIENT).toString('base64'),
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                method: "POST"
            })
            var ans = await refreshed.json();
            spotifyApi.setAccessToken(ans.access_token)
            const spotifyToYoutube = global.SpotifyToYoutube(spotifyApi)
            videoNames = []
            var botMessage = await message.channel.send(global.createEmbed(message, lang(message.guild.id, 'FINDING_MUSIC'), lang(message.guild.id, 'QUER_SPOTIFY'), []))

            //PLAYLIST
            if (matchPlaylist) {
                var playlists = await global.fetch("https://api.spotify.com/v1/playlists/" + matchPlaylist.groups?.url, {
                    headers: {
                        Accept: "application/json",
                        Authorization: "Bearer " + ans.access_token,
                        "Content-Type": "application/json"
                    }
                })
                var playlist = await playlists.json();
                var i = 0;
                var length = playlist.tracks.items.length
                var lastStamp = Date.now()
                await Promise.all(playlist.tracks.items.map(async (track: any, index: number) => {
                    var id: string = track.track.id
                    var youtubeID = await spotifyToYoutube(id).catch((err: Error) => { console.log(err) })
                    videoNames[index] = youtubeID
                    i++
                    if (Date.now() - lastStamp > 500) {
                        if (!message.guild) { return }
                        var embed = global.progressBar(message, lang(message.guild.id, 'FINDING_MUSIC'), lang(message.guild.id, `QUER_SPOTIFY`) + `\n${i}/${length}`, i / length)
                        botMessage.fetch().catch(async () => { botMessage = await message.channel.send(embed) })
                        botMessage.edit(embed)
                        lastStamp = Date.now()
                    }
                }))
            }

            //ALBUM
            if (matchAlbum) {
                var albums = await global.fetch("https://api.spotify.com/v1/albums/" + matchAlbum.groups?.url, {
                    headers: {
                        Accept: "application/json",
                        Authorization: "Bearer " + ans.access_token,
                        "Content-Type": "application/json"
                    }
                })
                var album = await albums.json();
                var i = 0;
                var length = album.tracks.items.length
                var lastStamp = Date.now()
                await Promise.all(album.tracks.items.map(async (track: any, index: number) => {
                    var id: string = track.id
                    var youtubeID = await spotifyToYoutube(id)
                    videoNames[index] = youtubeID
                    i++
                    if (Date.now() - lastStamp > 500) {
                        if (!message.guild) { return }
                        var embed = global.progressBar(message, lang(message.guild.id, 'FINDING_MUSIC'), lang(message.guild.id, 'QUER_SPOTIFY') + `\n${i}/${length}`, i / length)
                        botMessage.fetch().catch(async () => { botMessage = await message.channel.send(embed) })
                        botMessage.edit(embed)
                        lastStamp = Date.now()
                    }
                }))
            }

            //Artist
            if (matchArtist) {
                var albums = await global.fetch("https://api.spotify.com/v1/artists/" + matchArtist.groups?.url.split('?')[0] + "/top-tracks?market=CZ", {
                    headers: {
                        Accept: "application/json",
                        Authorization: "Bearer " + ans.access_token,
                        "Content-Type": "application/json"
                    }
                })
                var album = await albums.json();
                var i = 0;
                var length = album.tracks.length
                var lastStamp = Date.now()
                await Promise.all(album.tracks.map(async (track: any, index: number) => {
                    var id: string = track.id
                    var youtubeID = await spotifyToYoutube(id)
                    videoNames[index] = youtubeID
                    i++
                    if (Date.now() - lastStamp > 500) {
                        if (!message.guild) { return }
                        var embed = global.progressBar(message, lang(message.guild.id, 'FINDING_MUSIC'), lang(message.guild.id, 'QUER_SPOTIFY') + `\n${i}/${length}`, i / length)
                        botMessage.fetch().catch(async () => { botMessage = await message.channel.send(embed) })
                        botMessage.edit(embed)
                        lastStamp = Date.now()
                    }
                }))
            }

            //TRACK
            if (matchTrack) {
                var tracks = await global.fetch("https://api.spotify.com/v1/tracks/" + matchTrack.groups?.url, {
                    headers: {
                        Accept: "application/json",
                        Authorization: "Bearer " + ans.access_token,
                        "Content-Type": "application/json"
                    }
                })
                var track = await tracks.json();
                videoNames[0] = await spotifyToYoutube(track.id)
            }
        }
        else {
            message.channel.send(lang(message.guild.id, 'URL_INV'))
            return
        }

        var videos: Video[] = []
        var i = 0

        var ij = 0
        var lastStamp = Date.now()

        await Promise.all(videoNames.map(async (name: any, i: number) => {
            i++
            if (!message.guild) { return }
            var videoRaw: Video = await global.YouTube.getVideoByID(name)
            var video = { id: videoRaw.id, /*thumbnails: videoRaw.thumbnails.maxres.url,*/ title: videoRaw.title }
            console.log(video)
            videos.push(video)
            //write to user debug
            if (videoNames.length > 1) {

                //songa přidána do queue, už hraje bot
                if (Date.now() - lastStamp > 500 && botMessage) {
                    var embed = global.progressBar(message, lang(message.guild.id, 'FINDING_MUSIC'), lang(message.guild.id, 'QUER_YT') +
                        `\n ${ij}/${videoNames.length}`, ij / videoNames.length)
                    botMessage.fetch().catch(async () => { botMessage = await message.channel.send(embed) })
                    botMessage.edit(embed)
                    lastStamp = Date.now()
                }
                if (ij === videoNames.length) {
                    var del = true
                    if (botMessage) {
                        botMessage.fetch().catch(() => { del = false })
                        if (del) {
                            botMessage.delete()
                        }
                    }
                }
            }
        }))
        var playlistName = args[0]


        // console.log(global.servers[message.guild.id].playlists)
        if (!global.servers[message.guild.id].playlists) {
            global.servers[message.guild.id].playlists = []
        }
        // console.log(global.servers[message.guild.id].playlists)
        //Exituje uz stejnej name?
        var indexOldName = global.servers[message.guild.id].playlists?.findIndex((value) => { return value.name === playlistName })
        if (indexOldName === -1 || indexOldName === undefined) {
            global.servers[message.guild.id].playlists?.push({ videos, name: playlistName })
        }
        else {
            //@ts-expect-error
            global.servers[message.guild.id].playlists[indexOldName] = { videos, name: playlistName }

        }
        // console.log(global.servers[message.guild.id].playlists)
        global.serverManager(message.guild.id, true)
        botMessage.edit(lang(message.guild.id, 'LIST_SAVE_OK'))
        //playlist[]
    },
    permissions: [],
    requiredRoles: [],
    allowedIDs: [],
}
// googleapis.discover('youtube', 'v3').execute(function (err, client) {
//     var request = client.youtube.playlists.insert(
//         { part: 'snippet,status' },
//         {
//             snippet: {
//                 title: "hello",
//                 description: "description"
//             },
//             status: {
//                 privacyStatus: "private"
//             }
//         });
//     request.withAuthClient(oauth2Client).execute(function (err, res) {
//         console.log(res)
//     });
// });
// const http = require('http');
// const url = require('url');
// const open = require('open');
// const destroyer = require('server-destroy');
// const keys = { "web": { "client_id": "543847268583-qmmklb3mt2a07le441es40j3l45efce3.apps.googleusercontent.com", "project_id": "gmail-notifications-320810", "auth_uri": "https://accounts.google.com/o/oauth2/auth", "token_uri": "https://oauth2.googleapis.com/token", "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs", "client_secret": "NmBzVSYjwCTcrBBzc0ju66cy", "redirect_uris": ["urn:ietf:wg:oauth:2.0:oob", "http://localhost"] } }
// //T OD O : zrpovoznit url na authentifikaci a poslat do PM
// async function main() {
//     const oAuth2Client: any = await getAuthenticatedClient();
//     // Make a simple request to the People API using our pre-authenticated client. The `request()` method
//     // takes an GaxiosOptions object.  Visit https://github.com/JustinBeckwith/gaxios.
//     // const url = 'https://www.googleapis.com/youtube/v3/playlists';
//     const url = 'https://people.googleapis.com/v1/people/me?personFields=names';
//     const res = await oAuth2Client.request({ url });
//     console.log(res.data);

//     // After acquiring an access_token, you may want to check on the audience, expiration,
//     // or original scopes requested.  You can do that with the `getTokenInfo` method.
//     const tokenInfo = await oAuth2Client.getTokenInfo(
//         oAuth2Client.credentials.access_token
//     );
//     console.log(tokenInfo);
// }

// /**
// * Create a new OAuth2Client, and go through the OAuth2 content
// * workflow.  Return the full client to the callback.
// */
// function getAuthenticatedClient() {
//     return new Promise(async (resolve, reject) => {
//         // create an oAuth client to authorize the API call.  Secrets are kept in a `keys.json` file,
//         // which should be downloaded from the Google Developers Console.
//         const oAuth2Client = new OAuth2Client(
//             keys.web.client_id,
//             keys.web.client_secret,
//             keys.web.redirect_uris[0]
//         );

//         // Generate the url that will be used for the consent dialog.
//         const authorizeUrl = oAuth2Client.generateAuthUrl({
//             access_type: 'offline',
//             scope: 'https://www.googleapis.com/auth/userinfo.profile',
//         });
//         //const code = '4/1AX4XfWjR7xgMvCbv6-2k6GZaNgp2FmD3m51SfEDfrYHXA2Y_RUHnayzjcnc'
//         const code = '4/1AX4XfWj6g8uq7rx-gxnUicaFGfWcOT3tHDCmMVPakeIEBdbn6ZuHymuAqh4'
//         const r = await oAuth2Client.getToken(code);
//         // Make sure to set the credentials on the OAuth2 client.
//         oAuth2Client.setCredentials(r.tokens);
//         // console.info('Tokens acquired.');
//         resolve(oAuth2Client);
//         return

//         // Open an http server to accept the oauth callback. In this simple example, the
//         // only request to our webserver is to /oauth2callback?code=<code>
//         const server = http
//             .createServer(async (req: any, res: any) => {
//                 try {
//                     if (req.url.indexOf('/oauth2callback') > -1) {
//                         // acquire the code from the querystring, and close the web server.
//                         const qs = new url.URL(req.url, 'http://localhost:3000')
//                             .searchParams;
//                         const code = qs.get('code');
//                         // const code = '4/1AX4XfWjR7xgMvCbv6-2k6GZaNgp2FmD3m51SfEDfrYHXA2Y_RUHnayzjcnc'
//                         console.log(`Code is ${code}`);
//                         res.end('Authentication successful! Please return to the console.');
//                         server.destroy();

//                         // Now that we have the code, use that to acquire tokens.
//                         const r = await oAuth2Client.getToken(code);
//                         // Make sure to set the credentials on the OAuth2 client.
//                         oAuth2Client.setCredentials(r.tokens);
//                         console.info('Tokens acquired.');
//                         resolve(oAuth2Client);
//                     }
//                 } catch (e) {
//                     reject(e);
//                 }
//             })
//             .listen(3000, () => {
//                 // open the browser to the authorize url to start the workflow
//                 open(authorizeUrl, { wait: false }).then((cp: any) => cp.unref());
//             });
//         destroyer(server);
//     });
// }