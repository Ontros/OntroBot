import { Message } from "discord.js";

module.exports = {
    commands: ['skip', 's'],
    permissions: [],
    requiredRoles: [],
    allowedIDs: [],
    requireChannelPerms: true,
    callback: (message: Message, args: string[], text: string) => {
        if (!message.guild) {return}
        var server = global.servers[message.guild.id];
        const {lang} = global;
        if (server.queue.length < 2) {
            message.channel.send(lang(message.guild.id, 'NO_TO_SKIP'));
            return
        }
        if (server.dispathcher == undefined) {
            message.channel.send(lang(message.guild.id, "UNKWN_ERR"));
            throw new Error("dispathcher missing!!!");
        }
        console.log(server.connection);
        server.dispathcher.end();
        message.channel.send(lang(message.guild.id, 'SKIP'));
    },
}