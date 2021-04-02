import { Message } from "discord.js";

module.exports = {
    commands: ['add', 'addition'],
    expectedArgs: '<num1> <num2>',
    permissionError: '',
    minArgs: 2,
    maxArgs: 2,
    callback: (message: Message, args: string[], text: string) => {
        message.channel.send((parseInt(args[0])+parseInt(args[1])).toString());
    },
    permissions: [],
    requiredRoles: [],
    allowedIDs: [],
} 