import { Message } from "discord.js";

module.exports = {
    commands: ['penys', 'pp'],
    permissions: [],
    requiredRoles: [],
    allowedIDs: [],
    callback: async (message: Message, args: string[], text: string) => {
        if (!message.guild) { return }
        const { lang } = global;
        //Get player
        var requestedPlayer = message.author
        if (args[0]) {
            var user = await global.getUser(message, args[0])
            if (!user) {
                message.channel.send(lang(message.guild.id, 'INPUT_ERR_HALT')); return
            }
            requestedPlayer = user.user
        }
        var rand = require('random-seed').create(requestedPlayer.id)
        var penysSize = 'ERROR'
        if (requestedPlayer.id === '255345748441432064') {
            //message.channel.send(+lang(message.guild.id, 'PP_SIZE')+": 420 cm");
            penysSize = '420'
        }
        else if (requestedPlayer.id === '275639448299896833') {
            //message.reply(lang(message.guild.id, 'PP_SIZE')+": "+(-69).toString() + " cm");
            penysSize = '-69'
        }
        else {
            //message.reply();
            penysSize = (rand(2000) / 100).toString()
        }
        message.channel.send(`<@!${requestedPlayer.id}>, ${lang(message.guild.id, 'PP_SIZE') + ": " + penysSize + " cm"}`)
    }
}