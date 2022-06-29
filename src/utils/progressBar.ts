import { EmbedField, Message, MessageEmbed } from "discord.js";

module.exports = (message: Message, title: string, description: (string | null), status: number, imageURL?: (string | null)) => {
    //status - 0.0 - 1.0
    //var progressBar = '▬▬▬▬▬▬▬🔘▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬'
    var progressBar = ''
    status = Math.round(status * 19)
    for (var i = 0; i < 20; i++) {
        if (status != i) {
            progressBar += '▬'
        }
        else {
            progressBar += '🔘'
        }
    }
    return global.createEmbed(message, title, description + '\n' + progressBar, [], imageURL)
    // if(!message.guild) {return}
    // const {Discord,bot,lang} = global
    // if (!bot.user) {return}

    // if (!imageURL) {
    //     imageURL = bot.user.avatarURL()
    //     if(!imageURL) {message.channel.send(lang(message.guild.id, 'ERR_AVATAR')); return}
    // }

    // const embed: MessageEmbed = new Discord.MessageEmbed()
    // embed.setColor('#0099ff')
    //     .setTitle(title)
    //     .setThumbnail(imageURL)
    // description+=
    // if (description) {embed.setDescription(description)}
    '▬▬▬▬▬▬▬🔘▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬'
}