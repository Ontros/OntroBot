//const package = require('../../package.json');

import { Message, SlashCommandBuilder } from "discord.js";
import { CommandOptions } from "../../types";

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
        const { lang, Package } = global;
        if (!message.guild) { return }
        message.channel.send(lang(message.guild.id, 'CUR_VER') + ": " + Package.version);
    }
} as CommandOptions