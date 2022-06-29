import { Message } from "discord.js";

module.exports = {
    commands: ['ping'],
    permissions: [],
    requiredRoles: [],
    allowedIDs: [],
    callback: async (message: Message, args: string[], text: string) => {
        message.reply('pong!');
    },

}