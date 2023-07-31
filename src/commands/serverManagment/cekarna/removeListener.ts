import { Message, SlashCommandBuilder, SlashCommandSubcommandBuilder } from "discord.js";
import { CommandOptions } from "../../../types";
import getUser from "../../../utils/getUser";
import language from "../../../language";
import serverManager from "../../../server-manager";

export default {
    commands: ['removeListener'],
    expectedArgs: '<listenerID>',
    minArgs: 1,
    maxArgs: 1,
    permissions: ["ADMINISTRATOR"],
    requiredRoles: [],
    allowedIDs: [],
    data: new SlashCommandSubcommandBuilder().addUserOption(option => option
        .setName("listener").setNameLocalizations({ "cs": "posluchac" })
        .setDescription("The listener you want to remove").setDescriptionLocalizations({ "cs": "Uzivatel, ktereho chcete odebrat" })
        .setRequired(true)),
    isCommand: true,
    callback: async (message: Message, args: string[], text: string) => {
        if (!message.guild) { return }
        var server = global.servers[message.guild.id];
        const user = await getUser(message, args[0]); if (!user) { message.channel.send(language(message, 'USR_ID_NOT')); return; }
        if (server.cekarnaPings.includes(user.id)) {
            server.cekarnaPings.splice(server.cekarnaPings.indexOf(user.id), 1);
            message.channel.send(language(message, 'LIST_REM') + ': ' + user.displayName);
            serverManager(message.guild.id, true);
        }
        else {
            message.channel.send(language(message, 'LIST_NO_EXIST'));
        }
    }
} as CommandOptions