import { Message } from "discord.js";

module.exports = {
    commands: ['penys', 'pp'],
    permissions: [],
    requiredRoles: [],
    allowedIDs: [],
    callback: (message: Message, args: string[], text: string) => {
        var rand = require('random-seed').create(message.author.id)
        if (!message.guild) {return}
        const {lang} = global;
        if (message.author.id === '255345748441432064')
        {
            message.reply(lang(message.guild.id, 'PP_SIZE')+": 420 cm");
        }
        else if (message.author.id === '275639448299896833') 
        {
            message.reply(lang(message.guild.id, 'PP_SIZE')+": "+(-69).toString() + " cm");
        }
        else
        {
            message.reply(lang(message.guild.id, 'PP_SIZE')+": " + (rand(2000)/100).toString() + " cm");
        }
    }
}