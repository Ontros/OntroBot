import { Message, SlashCommandBuilder } from "discord.js";
import { CommandOptions } from "../../types";

module.exports = {
    commands: ['ily', 'iloveyou'],
    permissions: [],
    requiredRoles: [],
    allowedIDs: [],
    callback: async (message: Message, args: string[], text: string) => {
        message.reply('ily2')
    },
    minArgs: 0,
    maxArgs: 0,
    expectedArgs: "",
    isCommand: true,
    data: new SlashCommandBuilder()
} as CommandOptions