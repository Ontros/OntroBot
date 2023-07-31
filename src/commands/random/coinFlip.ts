import { Message, SlashCommandBuilder } from "discord.js";
import { CommandOptions } from "../../types";
import language from "../../language";

export default {
    commands: ['coinFlip', 'flip', 'mince'],
    permissions: [],
    requiredRoles: [],
    allowedIDs: [],
    expectedArgs: '',
    minArgs: 0,
    maxArgs: 0,
    data: new SlashCommandBuilder(),
    isCommand: true,
    callback: async (message: Message, args: string[], text: string) => {
        if (!message.guild) { return }
        const result = (Math.random() > 0.5) ? "COIN_HEADS" : "COIN_TAILS";
        message.channel.send(language(message, result))
    }
} as CommandOptions