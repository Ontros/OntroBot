import { Message, SlashCommandBuilder, SlashCommandSubcommandBuilder, TextChannel } from "discord.js";
import { CommandOptions } from "../../../types";
import getUser from "../../../utils/getUser";
import language, { languageI } from "../../../language";
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
    execute: async (interaction) => {
        if (!interaction.guild) { return }
        var server = global.servers[interaction.guild.id];
        const user = interaction.options.get("listener")?.user;
        if (!user) {
            interaction.reply(languageI(interaction, 'USR_ID_NOT'))
            return;
        }

        if (server.cekarnaPings.includes(user.id)) {
            server.cekarnaPings.splice(server.cekarnaPings.indexOf(user.id), 1);
            interaction.reply(languageI(interaction, 'LIST_REM') + ': ' + user.displayName);
            serverManager(interaction.guild.id, true);
        }
        else {
            interaction.reply(languageI(interaction, 'LIST_NO_EXIST'));
        }
    },
    callback: async (message: Message, args: string[], text: string) => {
        if (!message.guild) { return }
        var server = global.servers[message.guild.id];
        const user = await getUser(message, args[0]); if (!user) { (message.channel as TextChannel).send(language(message, 'USR_ID_NOT')); return; }
        if (server.cekarnaPings.includes(user.id)) {
            server.cekarnaPings.splice(server.cekarnaPings.indexOf(user.id), 1);
            (message.channel as TextChannel).send(language(message, 'LIST_REM') + ': ' + user.displayName);
            serverManager(message.guild.id, true);
        }
        else {
            (message.channel as TextChannel).send(language(message, 'LIST_NO_EXIST'));
        }
    }
} as CommandOptions