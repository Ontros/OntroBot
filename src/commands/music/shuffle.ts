import { Message } from "discord.js";
import shuffle from "../../utils/shuffle";
import disconnectBot from "../../utils/disconnectBot";

module.exports = {
    commands: ['shuffle'],
    permissions: [],
    requiredRoles: [],
    requireChannelPerms: false,
    maxArgs: 0,
    minArgs: 0,
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
}
