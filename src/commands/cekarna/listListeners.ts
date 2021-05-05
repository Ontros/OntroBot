import { Message } from "discord.js";

//const serverManager = require('../.././server-manager');
module.exports = {
    commands: ['listListeners'],
    expectedArgs: '',
    minArgs: 0,
    maxArgs: 0,
    permissions: [],
    requiredRoles: [],
    allowedIDs: [],
    callback: async (message: Message, args: string[], text: string) => {
        if (!message.guild) {return}
        global.servers[message.guild.id].cekarnaPings.forEach(async element => {
            if (!message.guild) {return}
            const user = await global.getUser(message, element); if (!user) {message.channel.send(global.lang(message.guild.id, 'USR_ID_NOT'));return;}
            try {
                message.channel.send(user.user.username);
            }
            catch {
                message.channel.send(element)
            }
        })
    }
}