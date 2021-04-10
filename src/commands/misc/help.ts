import { EmbedFieldData, Message, MessageEmbed } from "discord.js";

module.exports = {
    commands: ['help'],
    callback: (message: Message, args: string[], text: string) => {
        if(!message.guild) {return}
        const {Discord,bot,lang} = global
        if (!bot.user) {return}
        const avatarURL = bot.user.avatarURL()
        if(!avatarURL) {message.channel.send(lang(message.guild.id, 'ERR_AVATAR')); return}
        if (!args[0]) {
            //CATEGOTY LIST
            const embed: MessageEmbed = new Discord.MessageEmbed()
            embed.setColor('#0099ff')
	        .setTitle('Category list')
	        .setThumbnail(avatarURL)
            .setDescription(global.lang(message.guild.id,"_HELP_CATEGORY_NAME"))
            for (const categoryName in global.commands) {
                const category = global.commands[categoryName]
                embed.addField(category.name, global.lang(message.guild.id,category.description))
            }
            message.channel.send(embed)
            return
        }
        for (const categoryName in global.commands) {
            const category = global.commands[categoryName]
            if (categoryName.toLocaleLowerCase() === camelize(text).toLocaleLowerCase()||category.name === args[0].toLowerCase()) {
                //Commands list
                const embed: MessageEmbed = new Discord.MessageEmbed()
                embed.setColor('#0099ff')
                    .setTitle(category.name + ' commands:')
                    .setThumbnail(avatarURL)
                    .setDescription(global.lang(message.guild.id,"_HELP_COMMAND_NAME"))
                for (const commandName in category.commands) {
                    const command = category.commands[commandName]
                    embed.addField(camelToWords(command.name), global.lang(message.guild.id,'DES_'+commandName.toUpperCase()+'_SHORT'))
                }
                message.channel.send(embed)
                return
            }
            for (const commandName in category.commands) {
                if (/*commandName.toLocaleLowerCase() === args[0].toLocaleLowerCase()||*/camelize(text).toLocaleLowerCase() === commandName.toLocaleLowerCase()) {
                    //COMMAND DETAILS:
                    const command = category.commands[commandName]
                    const embed: MessageEmbed = new Discord.MessageEmbed()
                    embed.setColor('#0099ff')
                        .setTitle(command.name.toUpperCase())
                        .setThumbnail(avatarURL)
                        .addField('Aliases', command.aliases)
                        if(command.args) {embed.addField('Arguments', command.args)}
                        embed.addField('Description', global.lang(message.guild.id,'DES_'+commandName.toUpperCase()+'_LONG'))
                    message.channel.send(embed)
                    return
                }
                //TODO: COMMANDS AS A FILE
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
}

function camelToWords (text: string) {
    var result = text.replace( /([A-Z])/g, " $1" );
    return result.charAt(0).toUpperCase() + result.slice(1);
}

function camelize(str: string) {
    return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function(match, index) {
      if (+match === 0) return "";
      return index === 0 ? match.toLowerCase() : match.toUpperCase();
    });
}