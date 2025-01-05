import { Message, SlashCommandBuilder } from "discord.js";
import { CommandOptions } from "../../types";
import language from "../../language";
import getUser from "../../utils/getUser";

export default {
    commands: ['penys', 'pp'],
    permissions: [],
    requiredRoles: [],
    allowedIDs: [],
    expectedArgs: "<userID>",
    minArgs: 0,
    maxArgs: 1,
    isCommand: true,
    data: new SlashCommandBuilder().addUserOption(option => option.setRequired(false)
        .setName("user")
        .setNameLocalizations({ "cs": "uživatel" })
        .setDescription("Penys of user")
        .setDescriptionLocalizations({ "cs": "Penys od uživatele" })
    ),

    callback: async (message: Message, args: string[], text: string) => {
        if (!message.guild) { return }
        //Get player
        var requestedPlayer = message.author
        if (args[0]) {
            var user = await getUser(message, args[0])
            if (!user) {
                message.channel.send(language(message, 'INPUT_ERR_HALT')); return
            }
            requestedPlayer = user.user
        }
        var rand = require('random-seed').create(requestedPlayer.id)
        var penysSize = 'ERROR'
        if (requestedPlayer.id === '255345748441432064') {
            //message.channel.send(+language(message, 'PP_SIZE')+": 420 cm");
            penysSize = '30'
        }
        else if (requestedPlayer.id === '275639448299896833') {
            //message.reply(language(message, 'PP_SIZE')+": "+(-69).toString() + " cm");
            penysSize = '-69'
        }
        else {
            //message.reply();
            penysSize = (rand(2000) / 100).toString()
        }
        message.channel.send(`<@!${requestedPlayer.id}>, ${language(message, 'PP_SIZE') + ": " + penysSize + " cm"}`)
    }
} as CommandOptions