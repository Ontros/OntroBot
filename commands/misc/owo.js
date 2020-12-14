module.exports = {
    commands: ['owo', 'owo!', 'owo?'],
    permissions: [],
    requiredRoles: [],
    allowedIDs: [],
    callback: (message, arguments, text) => {
        message.channel.send("UwU!");
    }
}