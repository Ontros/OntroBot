import { Message } from 'discord.js';

module.exports = {
    commands: ['convert'],
    expectedArgs: '<url>',
    permissionError: '',
    minArgs: 1,
    maxArgs: 1,
    callback: async (message: Message, args: string[], text: string) => {
        const { bot, lang } = global
        if (!message.guild) { return; }

    },
    permissions: [],
    requiredRoles: [],
    allowedIDs: [],
}