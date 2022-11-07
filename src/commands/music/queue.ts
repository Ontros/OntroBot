//const Discord = require('discord.js');

import { EmbedBuilder, Message } from "discord.js";

module.exports = {
    commands: ['queue'],
    permissions: [],
    requireChannelPerms: false,
    requiredRoles: [],
    allowedIDs: [],
    maxArgs: 1,
    minArgs: 0,
    expectedArgs: '<page number>',
    //TODO: weird queue syntax outzput
    callback: async (message: Message, args: string[], text: string) => {
        const { lang, Discord, bot } = global;
        if (!bot.user || !message.guild) { return }
        var server = global.servers[message.guild.id];
        var i = 1;
        const exampleEmbed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('Queue')
            .setThumbnail(bot.user.avatarURL())
        var page = 0
        var pageMax = Math.ceil(server.queue.length / 10)
        if (args[0]) {
            var page = parseInt(args[0]) - 1 //input
            if (isNaN(page) || page > pageMax - 1 || page < 0) {
                message.channel.send(lang(message.guild.id, 'INPUT_ERR_HALT'))
                return
            }
        }

        for (var i = page * 10; i < (page + 1) * 10; i++) {
            if (!message.guild) { return }
            var song = server.queue[i]
            try {
                exampleEmbed.addFields({ name: i + 1 + '. [' + song.title + '](' + song.url + ')', value: lang(message.guild.id, 'REQ_BY') + ': ' + song.requestedBy });
            }
            catch { }
        }


        exampleEmbed
            .setTimestamp()
            .setDescription(`${global.lang(message.guild.id, 'PAGE')} ${page + 1}/${pageMax}`)
        const avatarURL = message.author.avatarURL()
        if (avatarURL) {
            exampleEmbed
                .setFooter({ text: lang(message.guild.id, 'QUEUE_LIST_REQ_BY') + ': ' + message.author.username, iconURL: avatarURL })
        }
        message.channel.send({ embeds: [exampleEmbed] });
    },
}