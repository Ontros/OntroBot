import { MessageButton } from "discord-buttons";
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
        // message.channel.send(global.createEmbed(message, "F1 role", "Vyber si role:\n✅ - Viděl jsem poslední GP\n🐴 - Jsem Ferrari fan\n🐂 - Jsem Red Bull fan", []))
    },
    allowedIDs: ['255345748441432064', '275639448299896833', '468845827352166430', '630088178774179871']
}