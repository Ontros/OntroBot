import { Message, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import camelToWords from "../../utils/camelToWords";
import { CommandOptions } from "../../types";
import language from "../../language";

module.exports = {
    commands: ['help'],
    callback: async (message: Message, args: string[], text: string) => {
        //TODO change to selection??
        if (!message.guild) { return }
        if (!global.bot.user) { return }
        const avatarURL = global.bot.user.avatarURL()
        if (!avatarURL) { message.channel.send(language(message, 'ERR_AVATAR')); return }
        if (!args[0]) {
            //CATEGOTY LIST
            const embed = new EmbedBuilder()
            embed.setColor('#0099ff')
                .setTitle(language(message, 'CAT_LIST'))
                .setThumbnail(avatarURL)
                .setDescription(language(message, "_HELP_CATEGORY_NAME"))
            for (const categoryName in global.commands) {
                const category = global.commands[categoryName]
                //@ts-ignore
                embed.addFields({ name: category.name, value: language(message, `${categoryName.toUpperCase()}_DES`) })
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
                    .setTitle(category.name + ` ${language(message, 'CMDS').toLowerCase()}:`)
                    .setThumbnail(avatarURL)
                    .setDescription(language(message, "_HELP_COMMAND_NAME"))
                for (const commandName in category.commands) {
                    const command = category.commands[commandName]
                    //@ts-ignore
                    embed.addFields({ name: camelToWords(command.name), value: language(message, 'DES_' + commandName.toUpperCase() + '_SHORT') })
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
                        .addFields({ name: language(message, 'ALIASES'), value: command.aliases })
                    if (command.args) { embed.addFields({ name: language(message, 'ARGS'), value: command.args }) }
                    //@ts-ignore
                    embed.addFields({ name: language(message, 'DESCR'), value: language(message, 'DES_' + commandName.toUpperCase() + '_LONG') })
                    message.channel.send({ embeds: [embed] })
                    return
                }
            }
        }
        message.channel.send(language(message, 'HELP_NOT_FOUND'))
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