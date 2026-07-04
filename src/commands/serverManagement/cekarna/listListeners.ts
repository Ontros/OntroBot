import { Message, SlashCommandBuilder, SlashCommandSubcommandBuilder, TextChannel } from "discord.js";
import { CommandOptions } from "../../../types";
import getUser, { getUserI } from "../../../utils/getUser";
import language, { languageI } from "../../../language";

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
    execute: async (interaction) => {
        if (!interaction.guildId) { return }
        let out = "List:\n"
        for (const element of global.servers[interaction.guildId].cekarnaPings) {
            if (!interaction.guildId) { return }
            const user = await getUserI(interaction, element);
            if (!user) { out += (languageI(interaction, 'USR_ID_NOT')) + "\n"; }
            else {
                try {
                    out += (user.user.username) + "\n"
                }
                catch {
                    out += (element) + "\n"
                }
            }
        }
        interaction.reply(out)
    },
    callback: async (message: Message, args: string[], text: string) => {
        if (!message.guild) { return }
        global.servers[message.guild.id].cekarnaPings.forEach(async element => {
            if (!message.guild) { return }
            const user = await getUser(message, element); if (!user) { (message.channel as TextChannel).send(language(message, 'USR_ID_NOT')); return; }
            try {
                (message.channel as TextChannel).send(user.user.username);
            }
            catch {
                (message.channel as TextChannel).send(element)
            }
        })
    }
} as CommandOptions