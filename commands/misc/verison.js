const package = require('../../package.json');

module.exports = {
    commands: ['version'],
    permissions: [],
    requiredRoles: [],
    allowedIDs: [],
    callback: (message, arguments, text) => {
        message.channel.send("Aktuální verze OntroBota je: "+package.version);
    }
}