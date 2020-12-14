const serverManager = require('../.././server-manager');
module.exports = {
    commands: ['removeListener'],
    expectedArgs: '<listenerID>',
    minArgs: 1,
    maxArgs: 1,
    permissions: ["ADMINISTRATOR"],
    requiredRoles: [],
    allowedIDs: [],
    callback: (message, args, text) => {
        var server = servers[message.guild.id];
        if (server.cekarnaPings.includes(args[0])) {
            server.cekarnaPings.splice(server.cekarnaPings.indexOf(args[0]),1);
            message.channel.send('Vrátný byl odebrán: '+args[0]);
            serverManager(message.guild.id, true);
        }
        else {
            message.channel.send('Vrátný neexistuje');
        }
    }
}