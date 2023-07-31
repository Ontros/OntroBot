import { Message, SlashCommandBuilder } from 'discord.js';
import { CommandOptions } from '../../types';
import language from '../../language';
import serverManager from '../../server-manager';

export default {
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
        if (!message.guild) { return; }
        if (!args[0]) {
            message.channel.send(language(message, 'CUR_PREF') + global.servers[message.guild.id].prefix)
            return
        }
        else {
            global.servers[message.guild.id].prefix = args[0]
            serverManager(message.guild.id, true)
            message.channel.send(language(message, 'SET_PREF') + args[0])
        }
    },
    permissions: ['ADMINISTRATOR'],
    requiredRoles: [],
    allowedIDs: [],
} as CommandOptions