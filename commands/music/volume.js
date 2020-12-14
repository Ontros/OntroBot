const serverManager = require('../.././server-manager');
module.exports = {
    commands: ['volume', 'vol', 'v'],
    expectedArgs: '<pocet procent>',
    minArgs: 0,
    maxArgs: 1,
    permissions: [],
    requiredRoles: [],
    allowedIDs: [],
    callback: (message, args, text) => {
        var server = servers[message.guild.id];
        if (!args[0])
        {
            message.reply('Aktuální hlasitost je: '+ server.volume + '%')
        }
        else 
        {
            server.volume = args[0]
            if (!server.queue) {
                server.dispathcher.setVolume(server.volume / 100);
            }
            message.reply('Hlasitost nastavena na: '+server.volume+ '%');
            serverManager(message.guild.id, true);
        }
    }
}