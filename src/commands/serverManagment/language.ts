import { EmbedBuilder, Message } from "discord.js";
import { Languages } from "../../types";

//const Discord = require('discord.js');
module.exports = {
    commands: ['language', 'lang'],
    expectedArgs: '<lang>',
    minArgs: 0,
    maxArgs: 2,
    permissions: ["ADMINISTRATOR"],
    requiredRoles: [],
    allowedIDs: [],
    callback: async (message: Message, args: string[], text: string) => {
        const { langJ, lang, Discord, bot } = global
        if (!message.guild || !bot.user) { return }
        if (args[0]) {
            if (args[0].toLowerCase() != "list") {
                var isValidLang = false;
                var arg: (Languages | null) = null
                langJ.languages.forEach(element => {
                    if (element === args[0].toLowerCase()) { arg = element }
                })
                if (arg) {
                    global.servers[message.guild.id].language = arg;
                    message.channel.send(lang(message.guild.id, 'LANG_SET') + ': ' + arg);
                    global.serverManager(message.guild.id, true);
                }
                else {
                    message.reply(lang(message.guild.id, 'LANG_UNKWN'))
                    console.log("USER TRYED TO SET LANGUAGE AS: " + args[0])
                }
            }
            else {
                const avatarURL = message.author.avatarURL()
                const Embed = new EmbedBuilder()
                    .setColor('#0099ff')
                    .setTitle('Language list')
                    .setThumbnail(bot.user.avatarURL());
                var langList = "";
                langJ.languages.forEach((langua: String) => {
                    langList += langua[0].toUpperCase() + langua.slice(1) + "\n";
                });
                Embed.addFields({ name: lang(message.guild.id, 'AVAILABLE_LANG') + ":", value: langList });
                Embed.setImage(avatarURL).setTimestamp()
                if (avatarURL) {
                    Embed.setFooter({ text: lang(message.guild.id, 'LANG_LIST_REQ_BY') + ': ' + message.author.username, iconURL: avatarURL })
                }
                message.channel.send({ embeds: [Embed] });
            }
        }
        else {
            message.channel.send(lang(message.guild.id, 'CURR_LANG_IS') + ': ' + global.servers[message.guild.id].language)
        }
    }
}