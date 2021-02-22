import { isNull } from "util";

//const serverManager = require('../.././server-manager');
module.exports = {
    commands: ['volume', 'vol', 'v'],
    expectedArgs: '<pocet procent>',
    minArgs: 0,
    maxArgs: 1,
    permissions: [],
    requiredRoles: [],
    allowedIDs: [],
    callback: (message: Message, args: string[], text: string) => {
        var server = global.servers[message.guild.id];
        const {lang} = global;
        if (!args[0])
        {
            message.channel.send(lang(message.guild.id, 'CURR_VOL') + ': '+ server.volume + '%')
        }
        else 
        {
            if (isNaN(parseFloat(args[0]))) {
                message.reply(lang(message.guild.id, 'VOL_NOT_NUM'));
                return;
            }
            server.volume = parseFloat(args[0])
            
            if (server.dispathcher) {
                server.dispathcher.setVolume(server.volume / 100);
            }
            message.channel.send(lang(message.guild.id, 'SET_VOL') + ': '+server.volume+ '%');
            serverManager(message.guild.id, true);
        }
    }
}