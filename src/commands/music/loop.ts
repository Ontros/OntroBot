module.exports = {
    commands: ['loop', 'l'],
    requireChannelPerms: true,
    callback: (message: Message, args: string[], text: string) => {
        var server = global.servers[message.guild.id];
        const {lang} = global;
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