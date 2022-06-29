import { Message } from "discord.js";

module.exports = async (message: Message, input: string) => {
    if (input[0] === '<') {
        input = input.substring(3, input.length - 1)
    }
    if (isNaN(parseInt(input))) {
        return null
    }
    if (!message.guild) { return }
    var user = await message.guild.members.fetch({ user: input, cache: false }).catch(() => { if (message.guild) { message.channel.send(global.lang(message.guild.id, 'UNKWN_ERR')) }; return null; });
    if (!user) {
        return null;
    }
    return user
}