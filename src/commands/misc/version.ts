import { Message, SlashCommandBuilder, TextChannel } from "discord.js";
import { CommandOptions } from "../../types";
import language, { languageI } from "../../language";
const Package = require('../../../package.json')

export default {
    commands: ['version', 'ver'],
    permissions: [],
    requiredRoles: [],
    allowedIDs: [],
    expectedArgs: "",
    isCommand: true,
    maxArgs: 0,
    minArgs: 0,
    data: new SlashCommandBuilder(),
    execute: async (interaction) => {
        if (!interaction.guild) { return }
        interaction.reply(languageI(interaction, 'CUR_VER') + ": " + Package.version);
    },
    callback: async (message: Message, args: string[], text: string) => {
        if (!message.guild) { return }
        (message.channel as TextChannel).send(language(message, 'CUR_VER') + ": " + Package.version);
    }
} as CommandOptions