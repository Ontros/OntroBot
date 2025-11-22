import { Message, SlashCommandBuilder, TextChannel } from "discord.js";
import disconnectBot from '../../utils/disconnectBot'
import { CommandOptions } from "../../types";
import language from "../../language";

export default {
    commands: ['stop', 'leave', 'disconnect'],
    permissions: [],
    expectedArgs: '',
    minArgs: 0,
    maxArgs: 0,
    requiredRoles: [],
    allowedIDs: [],
    isCommand: true,
    data: new SlashCommandBuilder(),
    requireChannelPerms: false,
    execute: async (interaction) => {
        interaction.reply("Deprecated lol");
    },
    callback: async (message: Message, args: string[], text: string) => {
        (message.channel as TextChannel).send("Deprecated lol");
        // if (!message.guild) { return }
        // var server = global.servers[message.guild.id];
        // for (var i = server.queue.length - 1; i >= 0; i--) {
        //     server.queue.splice(i, 1);
        // }
        // disconnectBot(message.guild.id);
        // (message.channel as TextChannel).send(language(message, 'STOP'));
    },
} as CommandOptions