import { Message } from "discord.js";

//const serverManager = require('../.././server-manager');
module.exports = {
    commands: ['removeListener'],
    expectedArgs: '<listenerID>',
    minArgs: 1,
    maxArgs: 1,
    permissions: ["ADMINISTRATOR"],
    requiredRoles: [],
    allowedIDs: [],
    callback: async (message: Message, args: string[], text: string) => {
        if (!message.guild) {return}
        var server = global.servers[message.guild.id];
        const user = await global.getUser(message, args[0]); if (!user) {message.channel.send(global.lang(message.guild.id, 'USR_ID_NOT'));return;}
        const {lang} = global;
        if (server.cekarnaPings.includes(user.id)) {
            server.cekarnaPings.splice(server.cekarnaPings.indexOf(user.id),1);
            message.channel.send(lang(message.guild.id, 'LIST_REM')+': '+user.displayName);
            global.serverManager(message.guild.id, true);
        }
        else {
            message.channel.send(lang(message.guild.id, 'LIST_NO_EXIST'));
        }
    }
}