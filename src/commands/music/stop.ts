import { Message, SlashCommandBuilder, TextChannel } from "discord.js";
import disconnectBot from '../../utils/disconnectBot'
import { CommandOptions } from "../../types";
import language from "../../language";

export default {
    commands: ['stop', 'leave'],
    permissions: [],
    expectedArgs: '',
    minArgs: 0,
    maxArgs: 0,
    requiredRoles: [],
    allowedIDs: [],
    isCommand: true,
    data: new SlashCommandBuilder(),
    requireChannelPerms: false,
    callback: async (message: Message, args: string[], text: string) => {
        if (!message.guild) { return }
        var server = global.servers[message.guild.id];
        if (server.dispathcher == undefined) {
            (message.channel as TextChannel).send(language(message, "NO_PLAY"));
            return;
        }
        for (var i = server.queue.length - 1; i >= 0; i--) {
            server.queue.splice(i, 1);
        }
        // server.connection.disconnect();
        disconnectBot(message.guild.id);
        (message.channel as TextChannel).send(language(message, 'STOP'));
    },
} as CommandOptions