module.exports = {
    commands: ['stop', 'leave'],
    permissions: [],
    requiredRoles: [],
    allowedIDs: [],
    requireChannelPerms: true,
    callback: (message, arguments, text) => {
        var server = servers[message.guild.id];
        //console.log(message.guild.voice.connection);
        if (message.guild.voice.connection){
            for (var i = server.queue.length -1; i >= 0; i--) {
                server.queue.splice(i, 1);
            }
            server.dispathcher.destroy();
            //message.member.voice.channel.leave();
            //say("Stop", message);
            message.channel.send(lang(message.guild.id, 'STOP'));
        }
        else {
            //say("Error", message);
        }
    }, 
}