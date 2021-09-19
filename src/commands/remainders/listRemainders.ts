import { Message } from 'discord.js';

module.exports = {
    commands: ['listRemainders', 'listRem'],
    expectedArgs: '<>',
    permissionError: '',
    minArgs: 0,
    maxArgs: 0,
    callback: async (message: Message, args: string[], text: string) => {
        const { bot, lang } = global
        if (!message.guild) { return; }

    },
    permissions: [],
    requiredRoles: [],
    allowedIDs: ['255345748441432064'],
}