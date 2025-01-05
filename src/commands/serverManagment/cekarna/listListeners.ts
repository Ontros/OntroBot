import { Message, SlashCommandBuilder, SlashCommandSubcommandBuilder } from "discord.js";
import { CommandOptions } from "../../../types";
import getUser from "../../../utils/getUser";
import language from "../../../language";

export default {
    commands: ['listListeners'],
    expectedArgs: '',
    minArgs: 0,
    maxArgs: 0,
    permissions: [],
    requiredRoles: [],
    allowedIDs: [],
    data: new SlashCommandSubcommandBuilder(),
    isCommand: true,
    callback: async (message: Message, args: string[], text: string) => {
        if (!message.guild) { return }
        global.servers[message.guild.id].cekarnaPings.forEach(async element => {
            if (!message.guild) { return }
            const user = await getUser(message, element); if (!user) { message.channel.send(language(message, 'USR_ID_NOT')); return; }
            try {
                message.channel.send(user.user.username);
            }
            catch {
                message.channel.send(element)
            }
        })
    }
} as CommandOptions