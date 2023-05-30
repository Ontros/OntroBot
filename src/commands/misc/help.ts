import { Message, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import camelToWords from "../../utils/camelToWords";
import { CommandOptions } from "../../types";

module.exports = {
    commands: ['help'],
    callback: async (message: Message, args: string[], text: string) => {
        //TODO change to selection??
        if (!message.guild) { return }
        const { Discord, bot, lang } = global
        if (!bot.user) { return }
        const avatarURL = bot.user.avatarURL()
        if (!avatarURL) { message.channel.send(lang(message.guild.id, 'ERR_AVATAR')); return }
        if (!args[0]) {
            //CATEGOTY LIST
            const embed = new EmbedBuilder()
            embed.setColor('#0099ff')
                .setTitle(lang(message.guild.id, 'CAT_LIST'))
                .setThumbnail(avatarURL)
                .setDescription(global.lang(message.guild.id, "_HELP_CATEGORY_NAME"))
            for (const categoryName in global.commands) {
                const category = global.commands[categoryName]
                embed.addFields({ name: category.name, value: global.lang(message.guild.id, `${categoryName.toUpperCase()}_DES`) })
            }
            message.channel.send({ embeds: [embed] })
            return
        }
        for (const categoryName in global.commands) {
            const category = global.commands[categoryName]
            if (categoryName.toLocaleLowerCase() === camelize(text).toLocaleLowerCase() || category.name === args[0].toLowerCase()) {
                //Commands list
                const embed = new EmbedBuilder()
                embed.setColor('#0099ff')
                    .setTitle(category.name + ` ${lang(message.guild.id, 'CMDS').toLowerCase()}:`)
                    .setThumbnail(avatarURL)
                    .setDescription(global.lang(message.guild.id, "_HELP_COMMAND_NAME"))
                for (const commandName in category.commands) {
                    const command = category.commands[commandName]
                    embed.addFields({ name: camelToWords(command.name), value: global.lang(message.guild.id, 'DES_' + commandName.toUpperCase() + '_SHORT') })
                }
                message.channel.send({ embeds: [embed] })
                return
            }
            for (const commandName in category.commands) {
                if (/*commandName.toLocaleLowerCase() === args[0].toLocaleLowerCase()||*/camelize(text).toLocaleLowerCase() === commandName.toLocaleLowerCase()) {
                    //COMMAND DETAILS:
                    const command = category.commands[commandName]
                    const embed = new EmbedBuilder()
                    embed.setColor('#0099ff')
                        .setTitle(command.name.toUpperCase())
                        .setThumbnail(avatarURL)
                        .addFields({ name: lang(message.guild.id, 'ALIASES'), value: command.aliases })
                    if (command.args) { embed.addFields({ name: lang(message.guild.id, 'ARGS'), value: command.args }) }
                    embed.addFields({ name: lang(message.guild.id, 'DESCR'), value: global.lang(message.guild.id, 'DES_' + commandName.toUpperCase() + '_LONG') })
                    message.channel.send({ embeds: [embed] })
                    return
                }
            }
        }
        message.channel.send(lang(message.guild.id, 'HELP_NOT_FOUND'))
    },
    minArgs: 0,
    maxArgs: null,
    expectedArgs: '<> or <commandName> or <categoryName>',
    permissions: [],
    requiredRoles: [],
    allowedIDs: [],
    data: new SlashCommandBuilder().addStringOption(option => {
        return option
            .setName("name").setNameLocalizations({ "cs": "název" }).setRequired(false)
            .setDescription("Name of command or category").setDescriptionLocalizations({ "cs": "Název příkazu nebo kategorie" })
    }),
    isCommand: true
} as CommandOptions



function camelize(str: string) {
    return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function (match, index) {
        if (+match === 0) return "";
        return index === 0 ? match.toLowerCase() : match.toUpperCase();
    });
}