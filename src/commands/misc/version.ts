import { Message, SlashCommandBuilder } from "discord.js";
import { CommandOptions } from "../../types";
import language from "../../language";
const Package = require('../../../package.json')

module.exports = {
    commands: ['version', 'ver'],
    permissions: [],
    requiredRoles: [],
    allowedIDs: [],
    expectedArgs: "",
    isCommand: true,
    maxArgs: 0,
    minArgs: 0,
    data: new SlashCommandBuilder(),
    callback: async (message: Message, args: string[], text: string) => {
        if (!message.guild) { return }
        message.channel.send(language(message, 'CUR_VER') + ": " + Package.version);
    }
} as CommandOptions