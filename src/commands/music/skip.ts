import { Message } from "discord.js";

module.exports = {
    commands: ['skip', 's', 'next'],
    permissions: [],
    requiredRoles: [],
    allowedIDs: [],
    minArgs: 0,
    maxArgs: 1,
    expectedArgs: '<number to skip>',
    requireChannelPerms: true,
    callback: async (message: Message, args: string[], text: string) => {
        if (!message.guild) { return }
        var server = global.servers[message.guild.id];
        const { lang } = global;
        if (server.queue.length < 2) {
            message.channel.send(lang(message.guild.id, 'NO_TO_SKIP'));
            return
        }
        if (server.dispathcher == undefined) {
            message.channel.send(lang(message.guild.id, "UNKWN_ERR"));
            throw new Error("dispathcher missing!!!");
        }
        var skipAmount = 1
        if (args[0]) {
            skipAmount = parseInt(args[0])
            if (isNaN(skipAmount) && skipAmount > 0 && skipAmount < server.queue.length - 1) {
                message.channel.send(lang(message.guild.id, 'INPUT_ERR_HALT'))
                return
            }
        }
        // console.log(skipAmount)
        for (var i = 0; i < skipAmount - 1; i++) {
            // console.log('skip')
            if (!server.queue[1]) {
                server.playing = false;
                server.queue = []
                if (!server.connection) {
                    throw new Error('connection not established skip:39')
                }
                server.connection.disconnect();
                return
            }
            if (server.loop === 0) {
                server.queue.shift();
            }
            else if (server.loop === 1) {
                //move song to end of queue
                var oldSong: any = server.queue.shift();
                server.queue.push(oldSong);
            }
        }
        server.dispathcher.end();
        message.channel.send(lang(message.guild.id, 'SKIP'));
    },
}