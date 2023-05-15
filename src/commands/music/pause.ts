import { Message } from "discord.js";

module.exports = {
    commands: ['pause'],
    permissions: [],
    requireChannelPerms: false,
    requiredRoles: [],
    allowedIDs: [],
    callback: async (message: Message, args: string[], text: string) => {
        if (!message.guild) { return }
        var server = global.servers[message.guild.id];
        const { lang } = global;
        if (server.player == undefined) {
            message.channel.send(lang(message.guild.id, "NO_PLAY"));
            return;
        }
        if (server.player.state.status !== "paused") {
            server.player.pause();
            message.channel.send(lang(message.guild.id, 'PAUSE'));
        }
        else {
            server.player.unpause()
            message.channel.send(lang(message.guild.id, 'RESUME'));
        }
    },
}