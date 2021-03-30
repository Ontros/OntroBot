//const serverManager = require('../.././server-manager');
module.exports = {
    commands: ['addListener'],
    expectedArgs: '<listenerID>',
    minArgs: 1,
    maxArgs: 1,
    permissions: ["ADMINISTRATOR"],
    requiredRoles: [],
    allowedIDs: [],
    callback: async (message: Message, args: string[], text: string) => {
        const {lang} = global
        var server = global.servers[message.guild.id];
        const user = await global.getUser(message, args[0]); if (!user) {message.channel.send(global.lang(message.guild.id, 'USR_ID_NOT'));return;}
        if (!server.cekarnaPings.includes(user.id)) {
            server.cekarnaPings.push(user.id);
            message.channel.send(lang(message.guild.id, 'LIST_ADD')+': '+user.displayName);
            serverManager(message.guild.id, true);
        }
        else {
            message.channel.send(lang(message.guild.id, 'LIST_EXISTS'));
        }
    }
}