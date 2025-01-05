import { EmbedBuilder, Message, SlashCommandBuilder, TextChannel } from "discord.js";
import { CommandOptions } from "../../types";
import language from "../../language";

export default {
    commands: ['queue', 'q'],
    permissions: [],
    requireChannelPerms: false,
    requiredRoles: [],
    allowedIDs: [],
    maxArgs: 1,
    minArgs: 0,
    expectedArgs: '<page number>',
    isCommand: true,
    data: new SlashCommandBuilder().addIntegerOption(option => {
        return option.setRequired(false).setMinValue(1).setName("page-number").setNameLocalizations({ "cs": "strana-seznamu" }).setDescription("Page number that will be shown").setDescriptionLocalizations({ cs: "Strana, která bude zobrazena" })
    }),
    //TODO: weird queue syntax outzput
    callback: async (message: Message, args: string[], text: string) => {
        if (!global.bot.user || !message.guild) { return }
        var server = global.servers[message.guild.id];
        var i = 1;
        const exampleEmbed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('Queue')
            .setThumbnail(global.bot.user.avatarURL())
        var page = 0
        var pageMax = Math.ceil(server.queue.length / 10)
        if (args[0]) {
            var page = parseInt(args[0]) - 1 //input
            if (isNaN(page) || page > pageMax - 1 || page < 0) {
                (message.channel as TextChannel).send(language(message, 'INPUT_ERR_HALT'))
                return
            }
        }
        for (var i = page * 10; i < (page + 1) * 10; i++) {
            if (!message.guild) { return }
            var song = server.queue[i]
            try {
                exampleEmbed.addFields({ name: i + 1 + '. [' + song.title + '](' + song.url + ')', value: language(message, 'REQ_BY') + ': ' + song.requestedBy });
            }
            catch { }
        }
        exampleEmbed
            .setTimestamp()
            .setDescription(`${language(message, 'PAGE')} ${page + 1}/${pageMax}`)
        const avatarURL = message.author.avatarURL()
        if (avatarURL) {
            exampleEmbed
                .setFooter({ text: language(message, 'QUEUE_LIST_REQ_BY') + ': ' + message.author.username, iconURL: avatarURL })
        }
        (message.channel as TextChannel).send({ embeds: [exampleEmbed] });
    },
} as CommandOptions