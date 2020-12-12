module.exports = {
    commands: ['stop'],
    permissions: [],
    requiredRoles: [],
    allowedIDs: [],
    callback: (message, arguments, text) => {
        var server = servers[message.guild.id];
        //console.log(message.guild.voice.connection);
        if (message.guild.voice.connection){
            for (var i = server.queue.length -1; i >= 0; i--) {
                server.queue.splice(i, 1);
            }
            server.dispathcher.end();
            say("Stop", message);
        }
        else {
             say("Error", message);
        }
    }, 
}