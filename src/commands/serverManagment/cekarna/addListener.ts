import { Message, SlashCommandBuilder, SlashCommandSubcommandBuilder, TextChannel } from "discord.js";
import { CommandOptions } from "../../../types";
import language from "../../../language";
import serverManager from "../../../server-manager";
import getUser from "../../../utils/getUser";

export default {
    commands: ['addListener'],
    expectedArgs: '<listenerID>',
    minArgs: 1,
    maxArgs: 1,
    permissions: ["ADMINISTRATOR"],
    requiredRoles: [],
    allowedIDs: [],
    data: new SlashCommandSubcommandBuilder()
        .addUserOption((option) => option
            .setName("listener").setNameLocalizations({ "cs": "posluchac" })
            .setDescription("The listener you want to add").setDescriptionLocalizations({ "cs": "Uzivatel, ktereho chcete pridat" })
            .setRequired(true))
    ,
    isCommand: true,
    callback: async (message: Message, args: string[], text: string) => {
        if (!message.guild) { return }
        var server = global.servers[message.guild.id];
        const user = await getUser(message, args[0]); if (!user) { (message.channel as TextChannel).send(language(message, 'USR_ID_NOT')); return; }
        if (!server.cekarnaPings.includes(user.id)) {
            server.cekarnaPings.push(user.id);
            (message.channel as TextChannel).send(language(message, 'LIST_ADD') + ': ' + user.displayName);
            serverManager(message.guild.id, true);
        }
        else {
            (message.channel as TextChannel).send(language(message, 'LIST_EXISTS'));
        }
    }
} as CommandOptions