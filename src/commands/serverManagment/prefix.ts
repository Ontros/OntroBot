import { Message, SlashCommandBuilder, TextChannel } from 'discord.js';
import { CommandOptions } from '../../types';
import language, { languageI } from '../../language';
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
    execute: async (interaction) => {
        if (!interaction.guildId) { return; }
        const newPrefix = interaction.options.get("new-prefix")?.value
        if (!newPrefix || typeof newPrefix != "string") {
            interaction.reply(languageI(interaction, 'CUR_PREF') + global.servers[interaction.guildId].prefix)
            return
        }
        else {
            global.servers[interaction.guildId].prefix = newPrefix
            serverManager(interaction.guildId, true);
            interaction.reply(languageI(interaction, 'SET_PREF') + newPrefix)
        }
    },
    callback: async (message: Message, args: string[], text: string) => {
        if (!message.guild) { return; }
        if (!args[0]) {
            (message.channel as TextChannel).send(language(message, 'CUR_PREF') + global.servers[message.guild.id].prefix)
            return
        }
        else {
            global.servers[message.guild.id].prefix = args[0]
            serverManager(message.guild.id, true);
            (message.channel as TextChannel).send(language(message, 'SET_PREF') + args[0])
        }
    },
    permissions: ['ADMINISTRATOR'],
    requiredRoles: [],
    allowedIDs: [],
} as CommandOptions