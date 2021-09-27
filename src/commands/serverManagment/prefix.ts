import { Message } from 'discord.js';

module.exports = {
    commands: ['prefix'],
    expectedArgs: '<name?>',
    permissionError: '',
    minArgs: 0,
    maxArgs: 1,
    callback: async (message: Message, args: string[], text: string) => {
        //TODO: ontroprefix -> vyvolani
        const { bot, lang } = global
        if (!message.guild) { return; }
        if (!args[0]) {
            message.channel.send(lang(message.guild.id, 'CUR_PREF') + global.servers[message.guild.id].prefix)
            return
        }
        else {
            global.servers[message.guild.id].prefix = args[0]
            global.serverManager(message.guild.id, true)
            message.channel.send(lang(message.guild.id, 'SET_PREF') + args[0])
        }
    },
    permissions: ['ADMINISTRATOR'],
    requiredRoles: [],
    allowedIDs: [],
}