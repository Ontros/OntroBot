import { Message, SlashCommandBuilder } from "discord.js";
import { CommandOptions } from "../../types";

export default {
    commands: ['azbuka'],
    expectedArgs: '<text>',
    permissionError: '',
    minArgs: 1,
    maxArgs: null,
    data: new SlashCommandBuilder().addStringOption(option => { return option.setRequired(true).setName("text").setNameLocalizations({ "cs": "text" }).setDescription("Text to be converted") }),
    isCommand: true,
    callback: async (message: Message, args: string[], text: string) => {
        if (!message.guild) { return; }
        message.channel.send(TextToAzbuka(text))
    },
    permissions: [],
    requiredRoles: [],
    allowedIDs: [],
} as CommandOptions

function TextToAzbuka(text: string) {
    var output = ''
    var previosChar: undefined | string = undefined
    text.split('').forEach((char, index, array) => {
        if (previosChar) {
            //Pasting from double
            output += previosChar
            previosChar = undefined
        }
        else {
            try {
                var double = findDouble(char + array[index + 1])
                if (double) {
                    previosChar = double
                }
                else {
                    output += charToAzbuka(char)
                }
            }
            catch {
                output += charToAzbuka(char)
            }
        }
    })
    return output
}

function findDouble(double: string) {
    switch (double) {
        case 'je': return 'е'
        case 'jo': return 'ё'
        case 'ch': return 'х'
        case 'šč': return 'щ'
        case 'ju': return 'ю'
        case 'ja': return 'я'
        default: return undefined
    }

}

function charToAzbuka(text: string) {
    switch (text) {
        case 'a': return 'а'
        case 'b': return 'б'
        case 'v': return 'в'
        case 'g': return 'г'
        case 'd': return 'д'
        case 'ž': return 'ж'
        case 'z': return 'з'
        case 'i': return 'и'
        case 'j': return 'й'
        case 'k': return 'к'
        case 'l': return 'л'
        case 'm': return 'м'
        case 'n': return 'н'
        case 'o': return 'о'
        case 'p': return 'п'
        case 'r': return 'р'
        case 's': return 'с'
        case 't': return 'т'
        case 'u': return 'у'
        case 'f': return 'ф'
        case 'h': return 'х'
        case 'c': return 'ц'
        case 'č': return 'ч'
        case 'š': return 'ш'
        case 'ů': return 'ъ'
        case 'y': return 'ы'
        case 'q': return 'ь'
        case 'e': return 'е'
        case 'ě': return 'э'
        case 'ý': return 'ю'
        case 'á': return 'я'
        case ' ': return ' '
        default: return '-'
    }
}