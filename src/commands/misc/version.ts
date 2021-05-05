//const package = require('../../package.json');

import { Message } from "discord.js";

module.exports = {
    commands: ['version', 'ver'],
    permissions: [],
    requiredRoles: [],
    allowedIDs: [],
    callback: (message: Message, args: string[], text: string) => {
        const {lang, Package} = global;
        if (!message.guild) {return}
        message.channel.send(lang(message.guild.id, 'CUR_VER')+": "+Package.version);
    }
}