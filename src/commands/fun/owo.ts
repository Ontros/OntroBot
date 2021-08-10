import { Message } from "discord.js";

module.exports = {
    commands: ['owo', 'owo!', 'owo?'],
    permissions: [],
    requiredRoles: [],
    allowedIDs: [],
    callback: async (message: Message, args: string[], text: string) => {
        message.channel.send("UwU!");
    }
}