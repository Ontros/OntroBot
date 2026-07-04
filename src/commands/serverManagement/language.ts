import { EmbedBuilder, Message, SlashCommandBuilder, TextChannel } from "discord.js";
import { CommandOptions, Languages } from "../../types";
import languageDATA from "../../languageDATA";
import language, { languageI } from "../../language";
import serverManager from "../../server-manager";

export default {
    commands: ['language', 'lang'],
    expectedArgs: '<lang>',
    minArgs: 0,
    maxArgs: 1,
    permissions: ["MANAGE_GUILD"],
    requiredRoles: [],
    data: new SlashCommandBuilder().addStringOption(option => option.setRequired(false).setName("language").setNameLocalizations({ cs: "jazyk" })
        .addChoices({ name: "Cesky", value: "cz" }, { name: "English", value: "en" }, { name: "Ostravsky", value: "dev" })
        .setDescription("New language").setDescriptionLocalizations({ cs: "Nový jazyk" })),
    isCommand: true,
    allowedIDs: [],
    execute: async (interaction) => {
        if (!interaction.guild || !global.bot.user) { return }
        const lan = interaction.options.get("language")?.value
        if (lan && typeof lan == "string") {
            if (lan.toLowerCase() != "list") {
                var arg: (Languages | null) = null
                languageDATA.languages.forEach(element => {
                    if (element === lan.toLowerCase()) { arg = element as Languages }
                })
                if (arg) {
                    global.servers[interaction.guild.id].language = arg;
                    interaction.reply(languageI(interaction, 'LANG_SET') + ': ' + arg);
                    serverManager(interaction.guild.id, true);
                }
                else {
                    interaction.reply(languageI(interaction, 'LANG_UNKWN'))
                    console.log("USER TRYED TO SET LANGUAGE AS: " + lan)
                }
            }
            else {
                const avatarURL = interaction.user.avatarURL()
                const Embed = new EmbedBuilder()
                    .setColor('#0099ff')
                    .setTitle('Language list')
                    .setThumbnail(global.bot.user.avatarURL());
                var langList = "";
                languageDATA.languages.forEach((langua: String) => {
                    langList += langua[0].toUpperCase() + langua.slice(1) + "\n";
                });
                Embed.addFields({ name: languageI(interaction, 'AVAILABLE_LANG') + ":", value: langList });
                Embed.setImage(avatarURL).setTimestamp()
                if (avatarURL) {
                    Embed.setFooter({ text: languageI(interaction, 'LANG_LIST_REQ_BY') + ': ' + interaction.user.username, iconURL: avatarURL })
                }
                interaction.reply({ embeds: [Embed] });
            }
        }
        else {
            interaction.reply(languageI(interaction, 'CURR_LANG_IS') + ': ' + global.servers[interaction.guild.id].language)
        }
    },
    callback: async (message: Message, args: string[], text: string) => {
        if (!message.guild || !global.bot.user) { return }
        if (args[0]) {
            if (args[0].toLowerCase() != "list") {
                var arg: (Languages | null) = null
                languageDATA.languages.forEach(element => {
                    if (element === args[0].toLowerCase()) { arg = element as Languages }
                })
                if (arg) {
                    global.servers[message.guild.id].language = arg;
                    (message.channel as TextChannel).send(language(message, 'LANG_SET') + ': ' + arg);
                    serverManager(message.guild.id, true);
                }
                else {
                    message.reply(language(message, 'LANG_UNKWN'))
                    console.log("USER TRYED TO SET LANGUAGE AS: " + args[0])
                }
            }
            else {
                const avatarURL = message.author.avatarURL()
                const Embed = new EmbedBuilder()
                    .setColor('#0099ff')
                    .setTitle('Language list')
                    .setThumbnail(global.bot.user.avatarURL());
                var langList = "";
                languageDATA.languages.forEach((langua: String) => {
                    langList += langua[0].toUpperCase() + langua.slice(1) + "\n";
                });
                Embed.addFields({ name: language(message, 'AVAILABLE_LANG') + ":", value: langList });
                Embed.setImage(avatarURL).setTimestamp()
                if (avatarURL) {
                    Embed.setFooter({ text: language(message, 'LANG_LIST_REQ_BY') + ': ' + message.author.username, iconURL: avatarURL })
                }
                (message.channel as TextChannel).send({ embeds: [Embed] });
            }
        }
        else {
            (message.channel as TextChannel).send(language(message, 'CURR_LANG_IS') + ': ' + global.servers[message.guild.id].language)
        }
    }
} as CommandOptions