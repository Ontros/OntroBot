import { Message, SlashCommandBuilder, TextChannel } from "discord.js";
import { CommandOptions } from "../../types";

export default {
    commands: ['measurePing'],
    permissions: [],
    requiredRoles: [],
    allowedIDs: [],
    minArgs: 0,
    maxArgs: 0,
    expectedArgs: "",
    isCommand: true,
    data: new SlashCommandBuilder(),
    execute: async (interaction) => {
        var start = Date.now();
        await interaction.reply("Pinging...");
        var end = Date.now();
        interaction.editReply(`**:ping_pong: Pong! Your Ping Is:-**\n  ${end - start}ms`)
    },
    callback: async (message: Message, args: string[], text: string) => {
        (message.channel as TextChannel).send("Pinging...").then(m => {
            var ping = m.createdTimestamp - message.createdTimestamp;
            m.edit(`**:ping_pong: Pong! Your Ping Is:-**\n  ${ping}ms`);
        });
    }
} as CommandOptions