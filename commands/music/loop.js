module.exports = {
    commands: ['loop', 'l'],
    callback: (message, arguments, text) => {
        var server = servers[message.guild.id];
        if (!server.loop) {
            message.reply("Loopinguju");
            server.loop = true;
        }
        else 
        {
            message.reply("Přestávám loopingovat");
            server.loop = false;
        }
    },
    permissions: [],
    requiredRoles: [],
    allowedIDs: [],
}