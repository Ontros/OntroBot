import { EmbedBuilder, Message, SlashCommandBuilder } from "discord.js";
import { CommandOptions, Languages } from "../../types";
import languageDATA from "../../languageDATA";
import language from "../../language";
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
                    message.channel.send(language(message, 'LANG_SET') + ': ' + arg);
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
                message.channel.send({ embeds: [Embed] });
            }
        }
        else {
            message.channel.send(language(message, 'CURR_LANG_IS') + ': ' + global.servers[message.guild.id].language)
        }
    }
} as CommandOptions