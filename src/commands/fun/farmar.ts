import { Message, SlashCommandBuilder } from "discord.js";
import { CommandOptions } from "../../types";

export default {
    commands: ['farmar'],
    expectedArgs: '',
    permissions: [],
    requiredRoles: [],
    allowedIDs: [],
    callback: async (message: Message, args: string[], text: string) => {
        message.reply('https://open.spotify.com/track/1ZiLd8Igub5HdqePlcrwVT?si=3cc26f7624a94431')
    },
    minArgs: 0,
    maxArgs: 0,
    isCommand: true,
    execute: async (interaction) => {
        await interaction.reply('https://open.spotify.com/track/1ZiLd8Igub5HdqePlcrwVT?si=3cc26f7624a94431')
    },
    data: new SlashCommandBuilder()
} as CommandOptions