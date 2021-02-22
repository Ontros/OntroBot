//const package = require('../../package.json');

module.exports = {
    commands: ['version', 'ver'],
    permissions: [],
    requiredRoles: [],
    allowedIDs: [],
    callback: (message: Message, args: string[], text: string) => {
        const {lang, Package} = global;
        message.channel.send(lang(message.guild.id, 'CUR_VER')+": "+Package.version);
    }
}