import { Message } from "discord.js";

module.exports = async (message: Message, input: string) => {
    if (input[0] === '<') {
        input = input.substring(2, input.length - 1)
    }
    if (isNaN(parseInt(input))) {
        return null
    }
    if (!message.guild) { return }
    var channel = await global.bot.channels.fetch(input).catch(() => { if (message.guild) { message.channel.send(global.lang(message.guild.id, 'UNKWN_ERR')) }; return null; });
    if (!channel || !channel.isTextBased()) {
        return null;
    }
    var textChannel = channel
    return textChannel
}