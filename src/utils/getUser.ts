import { Message } from "discord.js";

export default async (message: Message, input: string) => {
    try {
        const id = input.replace('<', '').replace('>', '').replace('@', '')
        console.log(id)
        if (!message.guild) { return }
        var user = await message.guild.members.fetch({ user: id, cache: false }).catch(() => {
            return null;
        });
        if (!user) {
            return null;
        }
        return user
    }
    catch {
        return null
    }
}