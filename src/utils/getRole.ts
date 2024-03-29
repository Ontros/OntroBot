import { Message } from "discord.js";

module.exports = async (message: Message, input: string) => {
    if (input[0] === '<') {
        input = input.substring(3, input.length - 1)
    }
    if (isNaN(parseInt(input))) {
        return null
    }
    if (!message.guild) { return }
    var role = await message.guild.roles.fetch(input).catch(() => { if (message.guild) { message.channel.send(global.lang(message.guild.id, 'UNKWN_ERR')) }; return null; });
    if (!role) {
        return null;
    }
    return role
}