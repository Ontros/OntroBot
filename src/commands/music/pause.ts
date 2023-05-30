import { Message, SlashCommandBuilder } from "discord.js";
import { CommandOptions } from "../../types";

module.exports = {
    commands: ['pause'],
    permissions: [],
    requireChannelPerms: false,
    requiredRoles: [],
    allowedIDs: [],
    minArgs: 0,
    maxArgs: 0,
    isCommand: true,
    expectedArgs: '',
    data: new SlashCommandBuilder(),
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
} as CommandOptions