//const serverManager = require('../.././server-manager');
module.exports = {
    commands: ['removeListener'],
    expectedArgs: '<listenerID>',
    minArgs: 1,
    maxArgs: 1,
    permissions: ["ADMINISTRATOR"],
    requiredRoles: [],
    allowedIDs: [],
    callback: (message: Message, args: string[], text: string) => {
        var server = global.servers[message.guild.id];
        const {lang} = global;
        if (server.cekarnaPings.includes(args[0])) {
            server.cekarnaPings.splice(server.cekarnaPings.indexOf(args[0]),1);
            message.channel.send(lang(message.guild.id, 'LIST_REM')+': '+args[0]);
            serverManager(message.guild.id, true);
        }
        else {
            message.channel.send(lang(message.guild.id, 'LIST_NO_EXIST'));
        }
    }
}