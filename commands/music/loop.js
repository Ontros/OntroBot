module.exports = {
    commands: ['loop', 'l'],
    requireChannelPerms: true,
    callback: (message, arguments, text) => {
        var server = servers[message.guild.id];
        if (!server.loop) {
            message.channel.send(lang(message.guild.id, 'LOOP_START'));
            server.loop = true;
        }
        else 
        {
            message.channel.send(lang(message.guild.id, 'LOOP_END'));
            server.loop = false;
        }
    },
    permissions: [],
    requiredRoles: [],
    allowedIDs: [],
}