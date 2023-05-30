import { Message, SlashCommandBuilder } from 'discord.js';

module.exports = {
    commands: ['prefix'],
    expectedArgs: '<name?>',
    permissionError: '',
    minArgs: 0,
    maxArgs: 1,
    data: new SlashCommandBuilder().addStringOption(option => {
        return option.setRequired(false)
            .setName("new-prefix").setNameLocalizations({ "cs": "nový-prefix" })
            .setDescription("New prefix value").setDescriptionLocalizations({ "cs": "Nová hodnota prefixu" })
    }),
    isCommand: true,
    callback: async (message: Message, args: string[], text: string) => {
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