import { Message } from "discord.js";

module.exports = {
    commands: ['ily', 'iloveyou'],
    expectedArgs: '',
    permissions: [],
    requiredRoles: [],
    allowedIDs: [],
    callback: async (message: Message, args: string[], text: string) => {
        message.reply('ily2')
    }
}