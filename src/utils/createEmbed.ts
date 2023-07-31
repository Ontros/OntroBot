import { EmbedField, Message, Embed, EmbedBuilder } from "discord.js";

export default (message: Message, title: string, description: (string | null), fields: EmbedField[], imageURL?: (string | null)) => {
    const { bot } = global
    if (!imageURL && bot.user) {
        imageURL = bot.user.avatarURL()
    }
    const embed = new EmbedBuilder()
    embed.setColor('#0099ff')
        .setTitle(title)
        .addFields(fields)
    if (imageURL) {
        embed.setThumbnail(imageURL)
    }
    if (description) { embed.setDescription(description) }
    message.channel.send({ embeds: [embed] })
    return embed
}