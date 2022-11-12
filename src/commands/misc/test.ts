import { Message } from "discord.js";

module.exports = {
    commands: ['test'],
    expectedArgs: '',
    minArgs: 0,
    maxArgs: 1,
    permissions: [],
    requiredRoles: [],
    callback: async (message: Message, Arguments: string[], text: string) => {
        message.reply("toast")
    },
    allowedIDs: ['255345748441432064', '275639448299896833', '468845827352166430', '630088178774179871', '275626532507090944']
}