import { Message, SlashCommandBuilder } from "discord.js";
import { SubcommandContainerOptions } from "../../types";

module.exports = {
    data: new SlashCommandBuilder(),
    permissions: ['ADMINISTRATOR'],
    requiredRoles: [],
    isCommand: false
} as SubcommandContainerOptions