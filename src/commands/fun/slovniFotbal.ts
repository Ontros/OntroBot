import { ChannelType, EmbedBuilder, Message, SlashCommandBuilder } from "discord.js";
import { CommandOptions } from "../../types";
import language, { languageI } from "../../language";
import db from "../../database";

const setSlovniFotbalChannel = db.prepare(`INSERT OR REPLACE INTO word_football_state (guild_id, channel_id, last_word, last_user, used_words) VALUES (?, ?, NULL, NULL, '[]')`);

export default {
    commands: ['slovnifotbal', 'sf'],
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
            .setDescription("Channel for word football")
            .addChannelTypes(ChannelType.GuildText)
            .setRequired(true)
        ),
    execute: async (interaction) => {
        if (!interaction.guildId) return;
        const channel = interaction.options.get("channel")?.channel;
        if (!channel) return;

        setSlovniFotbalChannel.run(interaction.guildId, channel.id);

        const embed = new EmbedBuilder()
            .setColor(0x0099ff)
            .setTitle('Slovní fotbal')
            .setDescription(`${languageI(interaction, 'WF_CHANNEL_SET')} <#${channel.id}>.\n${languageI(interaction, 'WF_RESET')}`);

        await interaction.reply({ embeds: [embed] });
    },
    callback: async (message: Message, args: string[]) => {
        if (!message.guildId) return;
        const channelId = args[0]?.replace(/[<#>]/g, '');
        if (!channelId) {
            message.reply("Please specify a valid channel.");
            return;
        }

        setSlovniFotbalChannel.run(message.guildId, channelId);

        const embed = new EmbedBuilder()
            .setColor(0x0099ff)
            .setTitle('Slovní fotbal')
            .setDescription(`${language(message, 'WF_CHANNEL_SET')} <#${channelId}>.\n${language(message, 'WF_RESET')}`);

        await message.reply({ embeds: [embed] });
    }
} as CommandOptions;
