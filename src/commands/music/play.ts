import console from "console";
import { Message, SlashCommandBuilder } from "discord.js";
import { CommandOptions, ReactionFormOption, Song, Video } from "../../types";
import { createAudioPlayer, createAudioResource, joinVoiceChannel, NoSubscriberBehavior, VoiceConnection } from "@discordjs/voice";
import playDL from 'play-dl'
import disconnectBot from "../../utils/disconnectBot";
import shuffle from "../../utils/shuffle";
import reactionForm from "../../utils/reactionForm";
import language from "../../language";

module.exports = {
    commands: ['play', 'p', 'search'],
    expectedArgs: '<url>',
    minArgs: 1,
    maxArgs: null,
    permissions: [],
    requiredRoles: [],
    allowedIDs: [],
    requireChannelPerms: true,
    data: new SlashCommandBuilder().addStringOption(option => {
        return option.setRequired(true).setName("video-information").setNameLocalizations({ "cs": "informace-o-videu" }).setDescriptionLocalizations({
            "cs": "Co chcete přehrát, podporuje YT video link, YT plalist link a název YT videa",
        }).setDescription("What you want to play, supports YT video links, YT playlist links and YT video names")
    }),
    isCommand: true,
    callback: async (message: Message, args: string[], text: string) => {
        //TODO: fix on youtube.com --> search, restarting playing when already playing, sometimes song randomly ends (probably switch to youtube-dl-exec)
        async function play(connection: VoiceConnection, message: Message) {
            try {
                if (!message.guild) { return }
                var server = global.servers[message.guild.id];
                server.playing = true;
                var newSongIndex = 0
                var newSong: Song = server.queue[newSongIndex]
                if (!newSong.duration) {
                    //@ts-ignore
                    newSong = await FindVideo(newSong.id, message, true)
                    server.queue[newSongIndex] = newSong
                }
                if (!newSong.url) {
                    message.channel.send("Missing song url")
                    disconnectBot(message.guild.id)
                    return
                }
                const stream = await playDL.stream(newSong.url)
                const audioResource = createAudioResource(stream.stream, { inputType: stream.type, inlineVolume: true })
                audioResource.volume?.setVolume(server.volume / 100)
                const player = createAudioPlayer({ behaviors: { noSubscriber: NoSubscriberBehavior.Play } })
                server.audioResource = audioResource
                server.player = player
                server.player.play(audioResource)
                server.dispathcher = connection.subscribe(player)
                server.connection = connection;
                server.player.on("stateChange", async function (oldState, newState) {
                    if (newState.status !== "idle") {
                        return //new song
                    }
                    if (!server.queue[1] && server.loop === 0) {
                        //KONEC
                        server.playing = false;
                        server.queue = []
                        disconnectBot(message.guild?.id)
                        return
                    }
                    if (server.loop === 0) {
                        server.queue.shift();
                    }
                    else if (server.loop === 1) {
                        //move song to end of queue
                        var oldSong: Song | undefined = server.queue.shift();
                        if (!oldSong) {
                            console.log("wtf play.ts queue end on loop 1 (SHOULD NOT HAPPEN!)")
                            message.channel.send(language(message, "UNKWN_ERR"))
                            return
                        }
                        server.queue.push(oldSong);
                    }
                    else if (server.loop === 2) {
                        server.queue = shuffle(server.queue)
                    }
                    //if 3 handled elsewhere
                    await play(connection, message);
                });
                server.player.on("error", function (Error: Error) {
                    console.log(Error)
                    console.log("dispatcher error");
                    if (!message.guild) { return }
                    message.channel.send(language(message, 'UNKWN_ERR'))
                });
            }
            catch (e) {
                console.log(e)
            }
        }

        async function FindVideo(url: string, message: Message, isID?: boolean): Promise<Song[]> {
            return new Promise(async (resolve) => {
                if (!message.guild?.id) {
                    return
                }
                const { YouTube } = global;
                var videos: any[] = []
                if (isID) {
                    try {
                        var video = await YouTube.getVideoByID(url)
                        resolve(video)
                        return
                    }
                    catch (e) {
                        message.channel.send(language(message, "UNKWN_ERR"))
                        console.log(e)
                        return

                    }
                }
                else {
                    //1. Zkusit najít playlist/podle URL
                    try {
                        const id = url
                        const id1 = url.match(/youtu(?:.*\/v\/|.*v\=|\.be\/)([A-Za-z0-9_\-]{11})/)?.[1]
                        const id2 = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)?.[1]
                        try {
                            var playlist = await YouTube.getPlaylist(url)
                            videos = await playlist.getVideos()
                        }
                        catch {
                            try {
                                videos = [await YouTube.getVideo(url)]
                            }
                            catch {
                                try {
                                    videos = [await YouTube.getVideoByID(id)]
                                }
                                catch {
                                    try {
                                        videos = [await YouTube.getVideoByID(id1)]
                                    }
                                    catch {
                                        try {
                                            videos = [await YouTube.getVideoByID(id2)]
                                        }
                                        catch {
                                            //2. Vyhledat
                                            try {
                                                var callbacks: ReactionFormOption[] = []
                                                videos = await YouTube.searchVideos(url, 10)
                                                for (var video of videos) {
                                                    callbacks.push({ callback: null, title: `${video.title} ${language(message, 'BY')} ${video.channel.title}` })
                                                }
                                                var output = await reactionForm(message, null, 'Search', 'What song do you want to play?', callbacks, true)
                                                if (output.botMessage.deletable)
                                                    output.botMessage.delete()
                                                var videos = [videos[output.id]]
                                            }
                                            catch (e) {
                                                message.channel.send(language(message, "UNKWN_ERR"))
                                                console.log(e)
                                                return
                                            }
                                        }
                                    }

                                }
                            }
                        }
                    }
                    catch {
                        message.channel.send(language(message, "UNKWN_ERR"))
                        return
                    }
                }
                resolve(videos.map((video: any) => {
                    return {
                        title: video.title,
                        id: video.id,
                        url: 'https://www.youtube.com/watch?v=' + video.id,
                        requestedBy: message.author,
                        duration: video.duration
                    }
                }))
            })
        }
        if (!message.guild) { return }
        var server = global.servers[message.guild.id];
        var videoName = text
        // var songs: Video[] = []
        if (!message.guild) { return }
        var playing = !(!server.connection || server.connection.state.status === 'disconnected')
        // if (songs.length > 0) {
        //     var videos: Song[] = songs.map((song: Video) => { return { title: song.title, id: song.id, url: 'https://www.youtube.com/watch?v=' + song.id, requestedBy: message.author.username, duration: undefined } })
        //     global.servers[message.guild.id].queue = [...global.servers[message.guild.id].queue, ...videos]
        // }
        // else {
        var foundVideos: Song[] = await FindVideo(videoName, message)
        // console.log(video)
        for (var vid of foundVideos) {
            // console.log("vid", vid)
            global.servers[message.guild.id].queue.push(vid)
            // console.log("q", global.servers[message.guild.id].queue)
        }
        // }
        if (!message.member?.voice.channel) {
            message.channel.send(language(message, 'NOT_IN_VC'));
            return;
        }
        if (playing) {
            message.channel.send(language(message, 'QUEUE_ADD'))
        }
        else {
            const connection = joinVoiceChannel({
                channelId: message.member.voice.channel.id,
                guildId: message.guild.id,
                adapterCreator: message.guild.voiceAdapterCreator
            })
            play(connection, message);
            message.channel.send(language(message, 'PLAY_START'));
        }
    }
} as CommandOptions