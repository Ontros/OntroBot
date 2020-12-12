module.exports = {
    commands: ['ping'],
    permissions: [],
    requiredRoles: [],
    allowedIDs: [],
    callback: (message, arguments, text) => {
        message.reply('pong!');
    },
    
}