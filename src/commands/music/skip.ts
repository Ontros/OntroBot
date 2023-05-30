import { Message, SlashCommandBuilder } from "discord.js";
import disconnectBot from "../../utils/disconnectBot";
import { CommandOptions } from "../../types";

module.exports = {
    commands: ['skip', 's', 'next'],
    permissions: [],
    requiredRoles: [],
    allowedIDs: [],
    minArgs: 0,
    maxArgs: 1,
    data: new SlashCommandBuilder().addIntegerOption(option => {
        return option.setRequired(false).setName("skip-by").setNameLocalizations({ "cs": "přeskočit-o" }).setDescription("Skip queue by amount").setDescriptionLocalizations({ cs: "Množství o kolik se přeskočí queue" })
    }),
    isCommand: true,
    expectedArgs: '<number to skip>',
    requireChannelPerms: false,
    callback: async (message: Message, args: string[], text: string) => {
        if (!message.guild) { return }
        var server = global.servers[message.guild.id];
        const { lang } = global;
        if (server.queue.length < 2) {
            message.channel.send(lang(message.guild.id, 'NO_TO_SKIP'));
            return
        }
        if (server.dispathcher == undefined) {
            message.channel.send(lang(message.guild.id, "NO_PLAY"));
            return
        }
        var skipAmount = 1
        if (args[0]) {
            skipAmount = parseInt(args[0])
            if (isNaN(skipAmount) && skipAmount > 0 && skipAmount < server.queue.length - 1) {
                message.channel.send(lang(message.guild.id, 'INPUT_ERR_HALT'))
                return
            }
        }
        if (skipAmount < 1) {
            skipAmount = 1
        }
        for (var i = 0; i < skipAmount - 1; i++) {
            if (!server.queue[1]) {
                server.playing = false;
                server.queue = []
                if (!server.connection) {
                    throw new Error('connection not established skip:39')
                }
                disconnectBot(message.guild.id)
                return
            }
            if (server.loop === 0) {
                server.queue.shift();
            }
            else if (server.loop === 1) {
                //move song to end of queue
                var oldSong: any = server.queue.shift();
                server.queue.push(oldSong);
            }
            //If 2/3 do nothing
        }
        server.dispathcher.player.stop();
        message.channel.send(lang(message.guild.id, 'SKIP'));
    },
} as CommandOptions