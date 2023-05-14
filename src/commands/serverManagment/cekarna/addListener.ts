import { Message, SlashCommandBuilder, SlashCommandSubcommandBuilder } from "discord.js";
import { CommandOptions } from "../../../types";


//const serverManager = require('../.././server-manager');
module.exports = {
    commands: ['addListener'],
    expectedArgs: '<listenerID>',
    minArgs: 1,
    maxArgs: 1,
    permissions: ["ADMINISTRATOR"],
    requiredRoles: [],
    allowedIDs: [],
    data: new SlashCommandSubcommandBuilder()
        .addUserOption((option) => option
            // .setNameLocalizations({ "cs": "Posluchac", "en-GB": "User" })
            .setDescriptionLocalizations({ "cs": "Uzivatel, ktereho chcete pridat", "en-GB": "The user you want to add" })
            .setName("user")
            .setDescription("the user you want to add")
            .setRequired(true))
    ,
    callback: async (message: Message, args: string[], text: string) => {
        if (!message.guild) { return }
        const { lang } = global
        var server = global.servers[message.guild.id];
        const user = await global.getUser(message, args[0]); if (!user) { message.channel.send(global.lang(message.guild.id, 'USR_ID_NOT')); return; }
        if (!server.cekarnaPings.includes(user.id)) {
            server.cekarnaPings.push(user.id);
            message.channel.send(lang(message.guild.id, 'LIST_ADD') + ': ' + user.displayName);
            global.serverManager(message.guild.id, true);
        }
        else {
            message.channel.send(lang(message.guild.id, 'LIST_EXISTS'));
        }
    }
} as CommandOptions