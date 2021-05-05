import { Message } from "discord.js";

module.exports = {
    commands: ['ping'],
    permissions: [],
    requiredRoles: [],
    allowedIDs: [],
    callback: (message: Message, args: string[], text: string) => {
        message.reply('pong!');
    },
    
}