import { Message } from "discord.js";

module.exports = {
    commands: ['test'],
    expectedArgs: '',
    minArgs: 0,
    maxArgs: 0,
    permissions: [],
    requiredRoles: [],
    callback: (message: Message, Arguments: string[], text: string) => {
        message.reply('lolmao');
    },
    allowedIDs: ['255345748441432064']
}