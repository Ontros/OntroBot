import { Message, SlashCommandBuilder } from "discord.js";
import { CommandOptions } from "../../types";

module.exports = {
    commands: ['add', 'addition'],
    expectedArgs: '<num1> <num2>',
    permissionError: '',
    minArgs: 2,
    maxArgs: 2,
    callback: async (message: Message, args: string[], text: string) => {
        message.channel.send((parseInt(args[0]) + parseInt(args[1])).toString());
    },
    permissions: [],
    requiredRoles: [],
    allowedIDs: [],
    data: new SlashCommandBuilder().addNumberOption(option => {
        return option.setName("first-number").setNameLocalizations({ "cs": "první-číslo" }).setRequired(true).setDescription("First number").setDescriptionLocalizations({ "cs": "První číslo" })
    }).addNumberOption(option => {
        return option.setName("second-number").setNameLocalizations({ "cs": "druhé-číslo" }).setRequired(true).setDescription("Second number").setDescriptionLocalizations({ "cs": "Druhé číslo" })
    }),
    isCommand: true
} as CommandOptions