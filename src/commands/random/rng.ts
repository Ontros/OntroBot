import { Message, SlashCommandBuilder } from "discord.js";
import { CommandOptions } from "../../types";
import language from "../../language";

export default {
    commands: ['rng'],
    expectedArgs: '<minNumber> <maxNumber>',
    permissionError: '',
    minArgs: 2,
    maxArgs: 2,
    data: new SlashCommandBuilder().addIntegerOption((option) => {
        return option.setRequired(true)
            .setName("minimum")
            .setDescription("Minimal value (inclusive)").setDescriptionLocalizations({ "cs": "Minimální celá hodnota (včetně)" })
    }).addIntegerOption((option) => {
        return option.setRequired(true)
            .setName("maximum")
            .setDescription("Maximal value (inclusive)").setDescriptionLocalizations({ "cs": "Maximální celá hodnota (včetně)" })
    }),
    isCommand: true,
    callback: async (message: Message, args: string[], text: string) => {
        if (!message.guild) { return; }
        var min = parseInt(args[0], 10)
        var max = parseInt(args[1], 10)
        if (isNaN(min) || isNaN(max)) { message.channel.send(language(message, 'INPUT_ERR_HALT')); return }
        message.channel.send(language(message, 'RANDNUM_IS') + getRandomInt(min, max))
    },
    permissions: [],
    requiredRoles: [],
    allowedIDs: [],
} as CommandOptions

function getRandomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}