import { Message } from "discord.js";

module.exports = {
    commands: ['nety', 'ne_ty'],
    expectedArgs: '',
    minArgs: 0,
    maxArgs: null,
    permissions: [],
    requiredRoles: [],
    allowedIDs: [],
    callback: async (message: Message, args: string[], text: string) => {
        //var server = servers[message.guild.id];
        if (!text) {
            message.channel.send("NE TY!")
        }
        else {
            message.channel.send(text + ", ne ty!")
        }
        message.delete();
    }
}