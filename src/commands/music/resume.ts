import { Message } from "discord.js";

module.exports = {
    commands: ['resume', 'unpause'],
    permissions: [],
    requiredRoles: [],
    requireChannelPerms: false,
    allowedIDs: [],
    callback: async (message: Message, args: string[], text: string) => {
        if (!message.guild) { return }
        var server = global.servers[message.guild.id];
        const { lang } = global;
        if (server.player == undefined) {
            message.channel.send(lang(message.guild.id, "NO_PLAY"));
            return;
        }
        if (server.player.state.status === "paused") {
            server.player.unpause();
            message.channel.send(lang(message.guild.id, 'RESUME'));
        }
        else {
            message.channel.send(lang(message.guild.id, 'NOT_PAUSED'))
        }
    },
}