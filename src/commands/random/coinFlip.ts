import { Message, SlashCommandBuilder, TextChannel } from "discord.js";
import { CommandOptions } from "../../types";
import language, { languageI } from "../../language";

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
    execute: async (interaction) => {
        if (!interaction.guild) { return }
        const result = (Math.random() > 0.5) ? "COIN_HEADS" : "COIN_TAILS";
        interaction.reply(languageI(interaction, result))
    },
    callback: async (message: Message, args: string[], text: string) => {
        if (!message.guild) { return }
        const result = (Math.random() > 0.5) ? "COIN_HEADS" : "COIN_TAILS";
        (message.channel as TextChannel).send(language(message, result))
    }
} as CommandOptions