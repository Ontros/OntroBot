import { ChannelType, Message, SlashCommandBuilder, SlashCommandSubcommandBuilder } from "discord.js";
import { CommandOptions } from "../../../types";

//const serverManager = require('../.././server-manager');
module.exports = {
    commands: ['setroom', 'setcekarna'],
    expectedArgs: '<roomId>',
    minArgs: 1,
    maxArgs: 1,
    permissions: ["ADMINISTRATOR"],
    requiredRoles: [],
    allowedIDs: [],
    data: new SlashCommandSubcommandBuilder().addChannelOption(option => option.addChannelTypes(ChannelType.GuildVoice).addChannelTypes(ChannelType.GuildStageVoice).setRequired(true)
        .setName("channel").setNameLocalizations({ "cs": "kanal" })
        .setDescription("Channel you want to use as a waiting room").setDescriptionLocalizations({ "cs": "Kanal, ktery chcete pouzit jako cekarnu" })
    ),
    isCommand: true,
    callback: async (message: Message, args: string[], text: string) => {
        if (!message.guild) { return }
        var server = global.servers[message.guild.id];
        const { lang } = global;
        const channel = message.guild.channels.cache.get(args[0])
        if (!channel || !channel.isVoiceBased()) {
            message.channel.send(lang(message.guild.id, 'CHAN_ID_NOT'));
            return
        }
        server.cekarnaChannel = args[0];
        message.channel.send(lang(message.guild.id, 'ROOM_SET') + ': ' + args[0]);
        global.serverManager(message.guild.id, true);
    }
} as CommandOptions