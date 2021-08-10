import { Message } from "discord.js";

module.exports = {
    commands: ['stop', 'leave'],
    permissions: [],
    requiredRoles: [],
    allowedIDs: [],
    requireChannelPerms: true,
    callback: async (message: Message, args: string[], text: string) => {
        if (!message.guild) { return }
        var server = global.servers[message.guild.id];
        const { lang } = global;
        if (server.dispathcher == undefined) {
            message.channel.send(lang(message.guild.id, "NO_PLAY"));
            return;
        }
        for (var i = server.queue.length - 1; i >= 0; i--) {
            server.queue.splice(i, 1);
        }
        if (server.connection) {
            server.connection.disconnect();
        }
        server.dispathcher.destroy();
        message.channel.send(lang(message.guild.id, 'STOP'));
    },
}