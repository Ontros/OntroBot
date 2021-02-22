//const serverManager = require('../.././server-manager');
module.exports = {
    commands: ['addListener'],
    expectedArgs: '<listenerID>',
    minArgs: 1,
    maxArgs: 1,
    permissions: ["ADMINISTRATOR"],
    requiredRoles: [],
    allowedIDs: [],
    callback: (message: Message, args: string[], text: string) => {
        const {lang} = global
        var server = global.servers[message.guild.id];
        if (!message.guild.member(args[0])) {
            message.channel.send(lang(message.guild.id, 'USR_ID_NOT'));
            return
        }
        if (!server.cekarnaPings.includes(args[0])) {
            server.cekarnaPings.push(args[0]);
            message.channel.send(lang(message.guild.id, 'LIST_ADD')+': '+args[0]);
            serverManager(message.guild.id, true);
        }
        else {
            message.channel.send(lang(message.guild.id, 'LIST_EXISTS'));
        }
    }
}