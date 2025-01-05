import { Message, SlashCommandBuilder, TextChannel } from "discord.js";
import { CommandOptions } from "../../types";

export default {
    commands: ['nety', 'ne_ty'],
    expectedArgs: '',
    minArgs: 0,
    maxArgs: null,
    permissions: [],
    requiredRoles: [],
    allowedIDs: [],
    isCommand: true,
    data: new SlashCommandBuilder().addUserOption(option => {
        return option.setRequired(false)
            .setName("user")
            .setNameLocalizations({ cs: "uživatel" })
            .setDescription("User you want to NETY")
            .setDescriptionLocalizations({ cs: "Uživatel, kterého chcete NETY-ovat" })
    }),
    callback: async (message: Message, args: string[], text: string) => {
        //var server = servers[message.guild.id];
        if (!text) {
            (message.channel as TextChannel).send("NE TY!")
        }
        else {
            (message.channel as TextChannel).send(text + ", ne ty!")
        }
        message.delete();
    }
} as CommandOptions