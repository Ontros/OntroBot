const package = require('../../package.json');

module.exports = {
    commands: ['version'],
    permissions: [],
    requiredRoles: [],
    allowedIDs: [],
    callback: (message, arguments, text) => {
        message.channel.send(lang(message.guild.id, 'CUR_VER')+": "+package.version);
    }
}