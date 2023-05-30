import { Message, SlashCommandBuilder } from "discord.js";
import { CommandOptions } from "../../types";

module.exports = {
    commands: ['ping'],
    permissions: [],
    requiredRoles: [],
    allowedIDs: [],
    minArgs: 0,
    maxArgs: 0,
    expectedArgs: "",
    isCommand: true,
    data: new SlashCommandBuilder(),
    callback: async (message: Message, args: string[], text: string) => {
        message.reply('pong!');
    },
} as CommandOptions