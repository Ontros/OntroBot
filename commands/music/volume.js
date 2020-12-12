module.exports = {
    commands: ['volume', 'vol', 'v'],
    expectedArgs: '<pocet procent>',
    minArgs: 1,
    maxArgs: 1,
    permissions: [],
    requiredRoles: [],
    allowedIDs: [],
    callback: (message, arguments, text) => {
        var server = servers[message.guild.id];
        if (!server.queue) 
        {
            message.reply('Nic nehraje debílku! :angry:')
        }
        else if (!args[1])
        {
            message.reply('Aktuální hlasitost je: '+ server.volume + '%')
        }
        else 
        {
            server.volume = args[1]
            server.dispathcher.setVolume(server.volume / 100);
            message.reply('Hlasitost nastavena na: '+server.volume+ '%')
        }
    }
}