import { Message, SlashCommandBuilder } from "discord.js";
import { SubcommandContainerOptions } from "../../types";

export default {
    data: new SlashCommandBuilder(),
    permissions: ['ADMINISTRATOR'],
    requiredRoles: [],
    isCommand: false
} as SubcommandContainerOptions