import { MessageButton } from "discord-buttons";
import { Message } from "discord.js";

module.exports = {
    commands: ['test'],
    expectedArgs: '',
    minArgs: 0,
    maxArgs: 1,
    permissions: [],
    requiredRoles: [],
    callback: async (message: Message, Arguments: string[], text: string) => {
        //console.log(message.content)
        const SpotifyToYoutube = require('spotify-to-youtube')
        const SpotifyWebApi = require('spotify-web-api-node')
        const clients = global.SPOTIFY_CLIENT.split(':')
        const spotifyApi = new SpotifyWebApi({
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
        // console.log(ans.access_token)
        spotifyApi.setAccessToken(ans.access_token)

        const spotifyToYoutube = SpotifyToYoutube(spotifyApi)
        const id = await spotifyToYoutube('spotify:track:54H0xbH1zRSpIooA56rHva')
        // console.log(id)
        return
        var playlists = await global.fetch("https://api.spotify.com/v1/playlists/3kcyHIeFhsQpVZaSkkj7kW", {
            headers: {
                Accept: "application/json",
                Authorization: "Bearer " + global.SPOTIFY_OAUTH,
                "Content-Type": "application/json"
            }
        })
        var playlist = await playlists.json();
        // console.log(playlist.tracks.items[0].track.id)
        playlist.tracks.items.forEach((track: any) => {
            var name: string = track.name
        })

        /*const embed = await global.createEmbed(message,'Tlačítka jsou cool','Máš rád tlačítka?',[])
        const anoTlac: (MessageButton) = new global.disbut.MessageButton()
        anoTlac.setLabel('ANO').setStyle('green').setID('ano')
        const neTlac: (MessageButton) = new global.disbut.MessageButton()
        neTlac.setLabel('NE').setStyle('red').setID('ne')
        console.log(embed)
        //@ts-ignore
        const mess = await message.channel.send('',{buttons:[anoTlac,neTlac],embed:embed})

        var list = async (button: any) => {
            global.bot.removeListener('clickButton',list)
            if (button.id ==='ano') {
                message.channel.send('Správně')
                button.defer();
            }
            if (button.id ==='ne') {
                message.channel.send('Špatně')
                button.defer();
            }
            //mess.delete()
        }
        global.bot.on('clickButton',list)
        console.log("done")*/

        //console.log(message.guild?.voiceStates.cache.array())
        //const callback = (message: Message,message2:Message, reaction: MessageReaction) => {global.reactionForm(message,message2, 'test', 'lmao?', [{callback, title: 'ano'},{callback, title: 'ne'}/*,{callback, title: 'nea'},{callback, title: 'nve'},{callback, title: 'nce'}*/])}
        //global.reactionForm(message,null, 'test', 'lmao?', [{callback, title: 'ano'},{callback, title: 'ne'}/*,{callback, title: 'nea'},{callback, title: 'nve'},{callback, title: 'nce'}*/])
        // var output = await global.reactionForm(message, null, 'test', 'chceš si koupit chalst?', [{callback: null, title: 'ano'},{callback: null, title: 'ne'}])
        // if (!output) {return}
        // //console.log(output)
        // if (output.id === 0) {
        //     var output2 = await global.reactionForm(message, output.botMessage, 'test', 'je ti víc nez 18?', [{callback: null, title: 'ano'},{callback: null, title: 'ne'}])
        //     if (!output2) {return}
        //     if (output2.id === 0) {
        //         output2.botMessage.delete()
        //         message.channel.send('here ya go')
        //         return
        //     }
        // }
        // output.botMessage.delete()
        // message.channel.send('GTFO')
        // // var output = await global.textInput(message,null,'test','kde si našel tu kočku?')
        // console.log(output.text)
        // output.botMessage.delete()
    },
    allowedIDs: ['255345748441432064', '275639448299896833', '468845827352166430', '630088178774179871']
}