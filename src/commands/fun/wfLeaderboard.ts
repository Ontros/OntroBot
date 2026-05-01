import { EmbedBuilder, Message, SlashCommandBuilder, TextChannel } from "discord.js";
import { CommandOptions } from "../../types";
import db from "../../database";
import language, { languageI } from "../../language";

const getTopWords = db.prepare(`
    SELECT user_id, successful_words, total_word_length
    FROM user_wf_stats
    WHERE guild_id = ?
    ORDER BY successful_words DESC
    LIMIT 5
`);

const getTopBroken = db.prepare(`
    SELECT user_id, streaks_broken
    FROM user_wf_stats
    WHERE guild_id = ?
    ORDER BY streaks_broken DESC
    LIMIT 5
`);

async function buildTopWordsField(guildId: string, client: any, wordsLabel: string, avgLabel: string): Promise<string> {
    const rows = getTopWords.all(guildId) as any[];
    if (rows.length === 0) return '-';
    const lines = await Promise.all(rows.map(async (row, i) => {
        const user = await client.users.fetch(row.user_id).catch(() => null);
        const name = user ? user.username : `<@${row.user_id}>`;
        const avg = row.successful_words > 0
            ? (row.total_word_length / row.successful_words).toFixed(1)
            : '0.0';
        return `${i + 1}. ${name} — **${row.successful_words}** ${wordsLabel} (${avgLabel} ${avg})`;
    }));
    return lines.join('\n');
}

async function buildTopBrokenField(guildId: string, client: any): Promise<string> {
    const rows = getTopBroken.all(guildId) as any[];
    if (rows.length === 0) return '-';
    const lines = await Promise.all(rows.map(async (row, i) => {
        const user = await client.users.fetch(row.user_id).catch(() => null);
        const name = user ? user.username : `<@${row.user_id}>`;
        return `${i + 1}. ${name} — **${row.streaks_broken}**`;
    }));
    return lines.join('\n');
}

export default {
    commands: ['wfleaderboard', 'wflb'],
    expectedArgs: '',
    minArgs: 0,
    maxArgs: 0,
    permissions: [],
    requiredRoles: [],
    allowedIDs: [],
    isCommand: true,
    data: new SlashCommandBuilder(),
    execute: async (interaction) => {
        if (!interaction.guildId) return;
        const wordsLabel = languageI(interaction, 'WF_LEADERBOARD_WORDS');
        const avgLabel = languageI(interaction, 'WF_LEADERBOARD_AVG');

        const [topWordsValue, topBrokenValue] = await Promise.all([
            buildTopWordsField(interaction.guildId, interaction.client, wordsLabel, avgLabel),
            buildTopBrokenField(interaction.guildId, interaction.client),
        ]);

        const embed = new EmbedBuilder()
            .setColor(0x0099ff)
            .setTitle(languageI(interaction, 'WF_LEADERBOARD_TITLE'))
            .addFields(
                { name: languageI(interaction, 'WF_LEADERBOARD_TOP_WORDS'), value: topWordsValue, inline: false },
                { name: languageI(interaction, 'WF_LEADERBOARD_TOP_BROKEN'), value: topBrokenValue, inline: false },
            );

        await interaction.reply({ embeds: [embed] });
    },
    callback: async (message: Message) => {
        if (!message.guildId) return;
        const wordsLabel = language(message, 'WF_LEADERBOARD_WORDS');
        const avgLabel = language(message, 'WF_LEADERBOARD_AVG');

        const [topWordsValue, topBrokenValue] = await Promise.all([
            buildTopWordsField(message.guildId, message.client, wordsLabel, avgLabel),
            buildTopBrokenField(message.guildId, message.client),
        ]);

        const embed = new EmbedBuilder()
            .setColor(0x0099ff)
            .setTitle(language(message, 'WF_LEADERBOARD_TITLE'))
            .addFields(
                { name: language(message, 'WF_LEADERBOARD_TOP_WORDS'), value: topWordsValue, inline: false },
                { name: language(message, 'WF_LEADERBOARD_TOP_BROKEN'), value: topBrokenValue, inline: false },
            );

        await (message.channel as TextChannel).send({ embeds: [embed] });
    }
} as CommandOptions;
