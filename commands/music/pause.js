module.exports = {
    commands: ['pause'],
    permissions: [],
    requireChannelPerms: true,
    requiredRoles: [],
    allowedIDs: [],
    callback: (message, arguments, text) => {
        var server = servers[message.guild.id];
        //console.log(message.guild.voice.connection);
        if (message.guild.voice.connection){
            server.dispathcher.pause();
            message.channel.send(lang(message.guild.id, 'PAUSE'));
        }
        else {
            //say("Error", message);
        }
    }, 
}