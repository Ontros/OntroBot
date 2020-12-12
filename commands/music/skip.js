module.exports = {
    commands: ['skip', 's'],
    permissions: [],
    requiredRoles: [],
    allowedIDs: [],
    callback: (message, arguments, text) => {
        server = servers[message.guild.id];
        server.dispathcher.end();
        message.channel.send('Úspěšně překočeno! :play_pause:');
    },
}