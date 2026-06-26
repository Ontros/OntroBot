import { ChannelType, EmbedBuilder, Message, SlashCommandBuilder } from "discord.js";
import { CommandOptions } from "../../types";
import language, { languageI } from "../../language";
import db from "../../database";

const setCountingChannel = db.prepare(`INSERT OR REPLACE INTO counting_state (guild_id, channel_id, current_count, last_user, best_count, total_counts) VALUES (?, ?, 0, NULL, 0, 0)`);
const clearCountingLog = db.prepare(`DELETE FROM counting_log WHERE guild_id = ?`);

export default {
    commands: ['counting', 'count'],
    expectedArgs: '<channel>',
    minArgs: 0,
    maxArgs: 1,
    permissions: ["ADMINISTRATOR"],
    requiredRoles: [],
    allowedIDs: [],
    isCommand: true,
    data: new SlashCommandBuilder()
        .addChannelOption(option => option
            .setName("channel")
            .setDescription("Channel for the counting game")
            .addChannelTypes(ChannelType.GuildText)
            .setRequired(true)
        ),
    execute: async (interaction) => {
        if (!interaction.guildId) return;
        const channel = interaction.options.get("channel")?.channel;
        if (!channel) return;

        setCountingChannel.run(interaction.guildId, channel.id);
        clearCountingLog.run(interaction.guildId);

        const embed = new EmbedBuilder()
            .setColor(0x0099ff)
            .setTitle('Counting')
            .setDescription(`${languageI(interaction, 'COUNT_CHANNEL_SET')} <#${channel.id}>.`);

        await interaction.reply({ embeds: [embed] });
    },
    callback: async (message: Message, args: string[]) => {
        if (!message.guildId) return;
        const channelId = args[0]?.replace(/[<#>]/g, '');
        if (!channelId) {
            message.reply("Please specify a valid channel.");
            return;
        }

        setCountingChannel.run(message.guildId, channelId);
        clearCountingLog.run(message.guildId);

        const embed = new EmbedBuilder()
            .setColor(0x0099ff)
            .setTitle('Counting')
            .setDescription(`${language(message, 'COUNT_CHANNEL_SET')} <#${channelId}>.`);

        await message.reply({ embeds: [embed] });
    }
} as CommandOptions;
