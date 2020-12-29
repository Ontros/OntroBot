const serverManager = require('../.././server-manager');
module.exports = {
    commands: ['setroom', 'setcekarna'],
    expectedArgs: '<roomId>',
    minArgs: 1,
    maxArgs: 1,
    permissions: ["ADMINISTRATOR"],
    requiredRoles: [],
    allowedIDs: [],
    callback: (message, args, text) => {
        var server = servers[message.guild.id];
        server.cekarnaChannel = args[0];
        message.channel.send(lang(message.guild.id, 'ROOM_SET')+': '+args[0]);
        serverManager(message.guild.id, true);
    }
}