import { EmbedField, Message, Embed, EmbedBuilder } from "discord.js";

module.exports = (message: Message, title: string, description: (string | null), fields: EmbedField[], imageURL?: (string | null)) => {
    const { Discord, bot, lang } = global
    if (!bot.user) { return }
    //reference progressBar.ts
    if (!imageURL) {
        imageURL = bot.user.avatarURL()
        // if (message) {
        //     if (!message.guild) { return }
        //     //if (!imageURL) { message.channel.send(lang(message.guild.id, 'ERR_AVATAR')); return }
        // }
        // if (!imageURL) { return }
    }
    const embed = new EmbedBuilder()
    embed.setColor('#0099ff')
        .setTitle(title)
        .addFields(fields)
    if (imageURL) {
        embed.setThumbnail(imageURL)
    }
    if (description) { embed.setDescription(description) }
    return embed
}