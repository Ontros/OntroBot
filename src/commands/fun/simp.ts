import { Message } from "discord.js";

module.exports = {
    commands: ['simp', 'simp?'],
    permissions: [],
    requiredRoles: [],
    allowedIDs: [],
    allowedServer: ['699609602685272074'],
    callback: (message: Message, args: string[], text: string) => {
        message.reply("Ne ty!");
    }
}