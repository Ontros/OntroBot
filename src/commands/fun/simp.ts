import { Message, SlashCommandBuilder } from "discord.js";
import { CommandOptions } from "../../types";

export default {
    commands: ['simp', 'simp?'],
    permissions: [],
    requiredRoles: [],
    allowedIDs: [],
    callback: async (message: Message, args: string[], text: string) => {
        message.reply("Ne ty!");
    },
    minArgs: 0,
    maxArgs: 0,
    expectedArgs: "",
    isCommand: true,
    execute: async (interaction) => {
        await interaction.reply('Ne ty!')
    },
    data: new SlashCommandBuilder()
} as CommandOptions