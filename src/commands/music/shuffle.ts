import { Message, SlashCommandBuilder } from "discord.js";
import shuffle from "../../utils/shuffle";
import disconnectBot from "../../utils/disconnectBot";
import { CommandOptions } from "../../types";

module.exports = {
    commands: ['shuffle'],
    permissions: [],
    requiredRoles: [],
    requireChannelPerms: false,
    expectedArgs: '',
    maxArgs: 0,
    minArgs: 0,
    data: new SlashCommandBuilder(),
    isCommand: true,
    allowedIDs: [],
    callback: async (message: Message, args: string[], text: string) => {
        if (!message.guild) { return }
        const server = global.servers[message.guild.id];
        const { lang } = global;
        if (server.queue.length < 2) {
            message.channel.send(lang(message.guild.id, 'NO_TO_SHUFFEL'));
            return
        }
        if (server.dispathcher == undefined || !server.queue) {
            message.channel.send(lang(message.guild.id, "NO_PLAY"));
            return
        }
        server.queue = shuffle(server.queue)
        server.dispathcher.player.stop();
        message.channel.send(lang(message.guild.id, 'SHUFFLED'));
    },
} as CommandOptions
