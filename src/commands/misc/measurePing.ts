import { Message, SlashCommandBuilder } from "discord.js";
import { CommandOptions } from "../../types";

module.exports = {
    commands: ['measurePing'],
    permissions: [],
    requiredRoles: [],
    allowedIDs: [],
    minArgs: 0,
    maxArgs: 0,
    expectedArgs: "",
    isCommand: true,
    data: new SlashCommandBuilder(),
    callback: async (message: Message, args: string[], text: string) => {
        message.channel.send("Pinging...").then(m => {
            var ping = m.createdTimestamp - message.createdTimestamp;
            m.edit(`**:ping_pong: Pong! Your Ping Is:-**\n  ${ping}ms`);
        });
    }
} as CommandOptions