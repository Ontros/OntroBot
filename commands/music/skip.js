module.exports = {
    commands: ['skip', 's'],
    permissions: [],
    requiredRoles: [],
    allowedIDs: [],
    requireChannelPerms: true,
    callback: (message, arguments, text) => {
        server = servers[message.guild.id];
        server.dispathcher.end();
        message.channel.send(lang(message.guild.id, 'SKIP'));
    },
}