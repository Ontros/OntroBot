module.exports = {
    commands: ['add', 'addition'],
    expectedArgs: '<num1> <num2>',
    permissionError: '',
    minArgs: 2,
    maxArgs: 2,
    callback: (message, arguments, text) => {
        message.channel.send(parseInt(arguments[0])+parseInt(arguments[1]));
    },
    permissions: [],
    requiredRoles: [],
    allowedIDs: [],
} 