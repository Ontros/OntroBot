import { Message, SlashCommandBuilder, TextChannel } from "discord.js";
import { CommandOptions } from "../../types";
import language from "../../language";

export default {
    commands: ['pause'],
    permissions: [],
    requireChannelPerms: false,
    requiredRoles: [],
    allowedIDs: [],
    minArgs: 0,
    maxArgs: 0,
    isCommand: true,
    expectedArgs: '',
    data: new SlashCommandBuilder(),
    callback: async (message: Message, args: string[], text: string) => {
        (message.channel as TextChannel).send("Deprecated lol");
        // if (!message.guild) { return }
        // var server = global.servers[message.guild.id];
        // if (server.player == undefined) {
        //     (message.channel as TextChannel).send(language(message, "NO_PLAY"));
        //     return;
        // }
        // if (server.player.state.status !== "paused") {
        //     server.player.pause();
        //     (message.channel as TextChannel).send(language(message, 'PAUSE'));
        // }
        // else {
        //     server.player.unpause();
        //     (message.channel as TextChannel).send(language(message, 'RESUME'));
        // }
    },
    execute: async (interaction) => {
        interaction.reply("Deprecated lol");
    },
} as CommandOptions