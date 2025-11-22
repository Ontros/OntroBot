import { Message, SlashCommandBuilder, TextChannel } from "discord.js";
import { CommandOptions } from "../../types";
import language from "../../language";

export default {
    commands: ['resume', 'unpause'],
    permissions: [],
    requiredRoles: [],
    expectedArgs: '',
    minArgs: 0,
    maxArgs: 0,
    data: new SlashCommandBuilder(),
    isCommand: true,
    requireChannelPerms: false,
    allowedIDs: [],
    execute: async (interaction) => {
        interaction.reply("Deprecated lol");
    },
    callback: async (message: Message, args: string[], text: string) => {
        (message.channel as TextChannel).send("Deprecated lol");
        // if (!message.guild) { return }
        // var server = global.servers[message.guild.id];
        // if (server.player == undefined) {
        //     (message.channel as TextChannel).send(language(message, "NO_PLAY"));
        //     return;
        // }
        // if (server.player.state.status === "paused") {
        //     server.player.unpause();
        //     (message.channel as TextChannel).send(language(message, 'RESUME'));
        // }
        // else {
        //     (message.channel as TextChannel).send(language(message, 'NOT_PAUSED'))
        // }
    },
} as CommandOptions