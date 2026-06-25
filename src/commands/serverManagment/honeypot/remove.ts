import { Message, SlashCommandSubcommandBuilder, TextChannel } from "discord.js";
import { CommandOptions } from "../../../types";
import language, { languageI } from "../../../language";
import db from "../../../database";

const deleteHoneypot = db.prepare(`DELETE FROM honeypot WHERE guild_id = ?`);
const getHoneypot = db.prepare(`SELECT * FROM honeypot WHERE guild_id = ?`);

export default {
    commands: ['honeypotremove'],
    expectedArgs: '',
    minArgs: 0,
    maxArgs: 0,
    permissions: ["ADMINISTRATOR"],
    requiredRoles: [],
    allowedIDs: [],
    data: new SlashCommandSubcommandBuilder(),
    isCommand: true,
    execute: async (interaction) => {
        if (!interaction.guildId) return;
        const existing = getHoneypot.get(interaction.guildId) as any;
        if (!existing) {
            await interaction.reply(languageI(interaction, 'HONEYPOT_NONE'));
            return;
        }
        deleteHoneypot.run(interaction.guildId);
        await interaction.reply(languageI(interaction, 'HONEYPOT_REMOVED'));
    },
    callback: async (message: Message, args: string[], text: string) => {
        if (!message.guild) return;
        const existing = getHoneypot.get(message.guild.id) as any;
        if (!existing) {
            await (message.channel as TextChannel).send(language(message, 'HONEYPOT_NONE'));
            return;
        }
        deleteHoneypot.run(message.guild.id);
        await (message.channel as TextChannel).send(language(message, 'HONEYPOT_REMOVED'));
    }
} as CommandOptions
