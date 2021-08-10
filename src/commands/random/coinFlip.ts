import { Message } from "discord.js";

module.exports = {
    commands: ['coinFlip', 'flip', 'mince'],
    permissions: [],
    requiredRoles: [],
    allowedIDs: [],
    callback: async (message: Message, args: string[], text: string) => {
        if (!message.guild) { return }
        const result = (Math.random() > 0.5) ? "COIN_HEADS" : "COIN_TAILS";
        message.channel.send(global.lang(message.guild.id, result))
    }
}