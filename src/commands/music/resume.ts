import { Message, SlashCommandBuilder } from "discord.js";
import { CommandOptions } from "../../types";
import language from "../../language";

export default {
    commands: ['resume', 'unpause'],
    permissions: [],
    requiredRoles: [],
    expectedArgs: '',
    minArgs: 0,
    maxArgs: 0,
    data: new SlashCommandBuilder(),
    isCommand: true,
    requireChannelPerms: false,
    allowedIDs: [],
    callback: async (message: Message, args: string[], text: string) => {
        if (!message.guild) { return }
        var server = global.servers[message.guild.id];
        if (server.player == undefined) {
            message.channel.send(language(message, "NO_PLAY"));
            return;
        }
        if (server.player.state.status === "paused") {
            server.player.unpause();
            message.channel.send(language(message, 'RESUME'));
        }
        else {
            message.channel.send(language(message, 'NOT_PAUSED'))
        }
    },
} as CommandOptions