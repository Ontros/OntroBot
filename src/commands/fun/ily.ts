import { Message, SlashCommandBuilder } from "discord.js";
import { CommandOptions } from "../../types";

export default {
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
    execute: async (interaction) => {
        await interaction.reply('ily2')
    },
    data: new SlashCommandBuilder()
} as CommandOptions