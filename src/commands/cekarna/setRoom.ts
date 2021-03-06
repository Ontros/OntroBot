//const serverManager = require('../.././server-manager');
module.exports = {
    commands: ['setroom', 'setcekarna'],
    expectedArgs: '<roomId>',
    minArgs: 1,
    maxArgs: 1,
    permissions: ["ADMINISTRATOR"],
    requiredRoles: [],
    allowedIDs: [],
    callback: (message: Message, args: string[], text: string) => {
        var server = global.servers[message.guild.id];
        const {lang} = global;
        if(message.guild.channels.cache.get(args[0]).type !== 'voice') {
            message.channel.send(lang(message.guild.id, 'CHAN_ID_NOT'));
            return
        }
        server.cekarnaChannel = args[0];
        message.channel.send(lang(message.guild.id, 'ROOM_SET')+': '+args[0]);
        serverManager(message.guild.id, true);
    }
}