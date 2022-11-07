import { Message } from "discord.js";

module.exports = {
    commands: ['resume'],
    permissions: [],
    requiredRoles: [],
    requireChannelPerms: true,
    allowedIDs: [],
    callback: async (message: Message, args: string[], text: string) => {
        if (!message.guild) { return }
        var server = global.servers[message.guild.id];
        const { lang } = global;
        //console.log(message.guild.voice.connection);
        if (server.player == undefined) {
            message.channel.send(lang(message.guild.id, "NO_PLAY"));
            return;
        }
        server.player.unpause();
        message.channel.send(lang(message.guild.id, 'RESUME'));
    },
}