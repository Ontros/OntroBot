import { Message } from "discord.js";
import language from "../language";

export default async (message: Message, input: string) => {
    if (input[0] === '<') {
        input = input.substring(3, input.length - 1)
    }
    if (isNaN(parseInt(input))) {
        return null
    }
    if (!message.guild) { return }
    var role = await message.guild.roles.fetch(input).catch(() => { if (message.guild) { message.channel.send(language(message, 'UNKWN_ERR')) }; return null; });
    if (!role) {
        return null;
    }
    return role
}