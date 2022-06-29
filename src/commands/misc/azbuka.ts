import { Message } from "discord.js";

module.exports = {
    commands: ['azbuka'],
    expectedArgs: '<text>',
    permissionError: '',
    minArgs: 1,
    maxArgs: null,
    callback: async (message: Message, args: string[], text: string) => {
        if (!message.guild) { return; }
        message.channel.send(TextToAzbuka(text))
    },
    permissions: [],
    requiredRoles: [],
    allowedIDs: [],
}

function TextToAzbuka(text: string) {
    var output = ''
    text.split('').forEach((text) => {
        output += charToAzbuka(text)
    })
    return output
}

function charToAzbuka(text: string) {
    switch (text) {
        case 'a': return 'а'
        case 'b': return 'б'
        case 'v': return 'в'
        case 'g': return 'д'
        case 'e': return 'е'
        case 'é': return 'ё'
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
        case 'w': return 'ш'
        case 'š': return 'щ'
        case 'ů': return 'ъ'
        case 'y': return 'ы'
        case 'q': return 'ь'
        case 'ě': return 'э'
        case 'ý': return 'ю'
        case 'á': return 'я'
        default: return '-'
    }
}