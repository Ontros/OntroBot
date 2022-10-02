import { Message } from "discord.js";

module.exports = {
    commands: ['farmar'],
    expectedArgs: '',
    permissions: [],
    requiredRoles: [],
    allowedIDs: [],
    callback: async (message: Message, args: string[], text: string) => {
        message.reply('https://open.spotify.com/track/1ZiLd8Igub5HdqePlcrwVT?si=3cc26f7624a94431')
    }
}