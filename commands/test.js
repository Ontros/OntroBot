module.exports = {
    commands: ['test'],
    expectedArgs: '',
    minArgs: 0,
    maxArgs: 0,
    permissions: [],
    requiredRoles: [],
    callback: (message, arguments, text) => {
        message.reply('lolmao');
    },
    allowedIDs: ['255345748441432064']
}