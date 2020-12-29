module.exports = {
    commands: ['resume'],
    permissions: [],
    requiredRoles: [],
    requireChannelPerms: true,
    allowedIDs: [],
    callback: (message, arguments, text) => {
        var server = servers[message.guild.id];
        //console.log(message.guild.voice.connection);
        if (message.guild.voice.connection){
            server.dispathcher.resume();
            message.channel.send(lang(message.guild.id, 'RESUME'));
        }
        else {
            //say("Error", message);
        }
    }, 
}