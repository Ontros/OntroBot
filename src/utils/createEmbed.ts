import { EmbedField, Message, MessageEmbed } from "discord.js";

module.exports = (message:Message, title: string, description: (string|null), fields: EmbedField[], imageURL?: (string|null)) => {
    if(!message.guild) {return}
    const {Discord,bot,lang} = global
    if (!bot.user) {return}
    if (!imageURL) {
        imageURL = bot.user.avatarURL()
        if(!imageURL) {message.channel.send(lang(message.guild.id, 'ERR_AVATAR')); return}
    }
    const embed: MessageEmbed = new Discord.MessageEmbed()
    embed.setColor('#0099ff')
        .setTitle(title)
        .setThumbnail(imageURL)
        .addFields(fields)
    if (description) {embed.setDescription(description)}
    return embed
}