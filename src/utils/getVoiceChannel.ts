import { Message, TextChannel } from "discord.js";
import language from "../language";

export default async (message: Message, input: string) => {
    if (input[0] === '<') {
        input = input.substring(2, input.length - 1)
    }
    if (isNaN(parseInt(input))) {
        return null
    }
    if (!message.guild) { return }
    var channel = await global.bot.channels.fetch(input).catch(() => { if (message.guild) { (message.channel as TextChannel).send(language(message, 'UNKWN_ERR')) }; return null; });
    if (!channel || !channel.isVoiceBased()) {
        return null;
    }
    return channel
}