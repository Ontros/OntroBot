import { Message, SlashCommandBuilder, TextChannel } from "discord.js";
import { CommandOptions } from "../../types";

export default {
    commands: ['add', 'addition'],
    expectedArgs: '<num1> <num2>',
    permissionError: '',
    minArgs: 2,
    maxArgs: 2,
    callback: async (message: Message, args: string[], text: string) => {
        (message.channel as TextChannel).send((parseInt(args[0]) + parseInt(args[1])).toString());
    },
    permissions: [],
    requiredRoles: [],
    allowedIDs: [],
    data: new SlashCommandBuilder().addNumberOption(option => {
        return option.setName("first-number").setNameLocalizations({ "cs": "první-číslo" }).setRequired(true).setDescription("First number").setDescriptionLocalizations({ "cs": "První číslo" })
    }).addNumberOption(option => {
        return option.setName("second-number").setNameLocalizations({ "cs": "druhé-číslo" }).setRequired(true).setDescription("Second number").setDescriptionLocalizations({ "cs": "Druhé číslo" })
    }),
    execute: async (interaction) => {
        var num1 = interaction.options.get('first-number')?.value as number
        var num2 = interaction.options.get('second-number')?.value as number
        if (num1 === undefined || num2 == undefined) {
            interaction.reply("Zadej 2 čísla, kreténe")
            return
        }
        interaction.reply((num1 + num2).toString())
    },
    isCommand: true
} as CommandOptions