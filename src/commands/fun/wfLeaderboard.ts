import { EmbedBuilder, Message, SlashCommandBuilder, TextChannel } from "discord.js";
import { CommandOptions } from "../../types";
import db from "../../database";
import language, { languageI } from "../../language";
import getUser from "../../utils/getUser";

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

const getStreakState = db.prepare(`
    SELECT streak_length, best_streak
    FROM word_football_state
    WHERE guild_id = ?
`);

const getUserStats = db.prepare(`
    SELECT successful_words, total_word_length, streaks_broken
    FROM user_wf_stats
    WHERE guild_id = ? AND user_id = ?
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

function buildUserStatsEmbed(
    guildId: string,
    userId: string,
    username: string,
    title: string,
    wordsLabel: string,
    brokenLabel: string,
    avgLabel: string,
    noneLabel: string,
): EmbedBuilder {
    const row = getUserStats.get(guildId, userId) as any;
    if (!row) {
        return new EmbedBuilder().setColor(0x0099ff).setTitle(`${title} — ${username}`).setDescription(noneLabel);
    }
    const avg = row.successful_words > 0
        ? (row.total_word_length / row.successful_words).toFixed(1)
        : '0.0';
    return new EmbedBuilder()
        .setColor(0x0099ff)
        .setTitle(`${title} — ${username}`)
        .addFields(
            { name: wordsLabel, value: `**${row.successful_words}**`, inline: true },
            { name: brokenLabel, value: `**${row.streaks_broken}**`, inline: true },
            { name: avgLabel, value: `**${avg}**`, inline: true },
        );
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
    expectedArgs: '[user]',
    minArgs: 0,
    maxArgs: 1,
    permissions: [],
    requiredRoles: [],
    allowedIDs: [],
    isCommand: true,
    data: new SlashCommandBuilder().addUserOption(option =>
        option.setRequired(false)
            .setName('user')
            .setNameLocalizations({ 'cs': 'uživatel' })
            .setDescription('Show stats for a specific user')
            .setDescriptionLocalizations({ 'cs': 'Zobrazí statistiky konkrétního uživatele' })
    ),
    execute: async (interaction) => {
        if (!interaction.guildId) return;

        const targetUser = interaction.options.get('user')?.user;
        if (targetUser) {
            const embed = buildUserStatsEmbed(
                interaction.guildId,
                targetUser.id,
                targetUser.username,
                languageI(interaction, 'WF_USER_STATS_TITLE'),
                languageI(interaction, 'WF_USER_STATS_WORDS'),
                languageI(interaction, 'WF_USER_STATS_BROKEN'),
                languageI(interaction, 'WF_USER_STATS_AVG_LEN'),
                languageI(interaction, 'WF_USER_STATS_NONE'),
            );
            await interaction.reply({ embeds: [embed] });
            return;
        }

        const wordsLabel = languageI(interaction, 'WF_LEADERBOARD_WORDS');
        const avgLabel = languageI(interaction, 'WF_LEADERBOARD_AVG');

        const [topWordsValue, topBrokenValue] = await Promise.all([
            buildTopWordsField(interaction.guildId, interaction.client, wordsLabel, avgLabel),
            buildTopBrokenField(interaction.guildId, interaction.client),
        ]);

        const streakRow = getStreakState.get(interaction.guildId) as any;
        const currentStreak = streakRow?.streak_length ?? 0;
        const bestStreak = streakRow?.best_streak ?? 0;

        const embed = new EmbedBuilder()
            .setColor(0x0099ff)
            .setTitle(languageI(interaction, 'WF_LEADERBOARD_TITLE'))
            .addFields(
                { name: languageI(interaction, 'WF_LEADERBOARD_CURRENT_STREAK'), value: `**${currentStreak}**`, inline: true },
                { name: languageI(interaction, 'WF_LEADERBOARD_BEST_STREAK'), value: `**${bestStreak}**`, inline: true },
                { name: languageI(interaction, 'WF_LEADERBOARD_TOP_WORDS'), value: topWordsValue, inline: false },
                { name: languageI(interaction, 'WF_LEADERBOARD_TOP_BROKEN'), value: topBrokenValue, inline: false },
            );

        await interaction.reply({ embeds: [embed] });
    },
    callback: async (message: Message, args: string[]) => {
        if (!message.guildId) return;

        if (args[0]) {
            const resolved = await getUser(message, args[0]);
            if (!resolved) {
                await (message.channel as TextChannel).send(language(message, 'INPUT_ERR_HALT'));
                return;
            }
            const target = resolved.user;
            const embed = buildUserStatsEmbed(
                message.guildId,
                target.id,
                target.username,
                language(message, 'WF_USER_STATS_TITLE'),
                language(message, 'WF_USER_STATS_WORDS'),
                language(message, 'WF_USER_STATS_BROKEN'),
                language(message, 'WF_USER_STATS_AVG_LEN'),
                language(message, 'WF_USER_STATS_NONE'),
            );
            await (message.channel as TextChannel).send({ embeds: [embed] });
            return;
        }

        const wordsLabel = language(message, 'WF_LEADERBOARD_WORDS');
        const avgLabel = language(message, 'WF_LEADERBOARD_AVG');

        const [topWordsValue, topBrokenValue] = await Promise.all([
            buildTopWordsField(message.guildId, message.client, wordsLabel, avgLabel),
            buildTopBrokenField(message.guildId, message.client),
        ]);

        const streakRow = getStreakState.get(message.guildId) as any;
        const currentStreak = streakRow?.streak_length ?? 0;
        const bestStreak = streakRow?.best_streak ?? 0;

        const embed = new EmbedBuilder()
            .setColor(0x0099ff)
            .setTitle(language(message, 'WF_LEADERBOARD_TITLE'))
            .addFields(
                { name: language(message, 'WF_LEADERBOARD_CURRENT_STREAK'), value: `**${currentStreak}**`, inline: true },
                { name: language(message, 'WF_LEADERBOARD_BEST_STREAK'), value: `**${bestStreak}**`, inline: true },
                { name: language(message, 'WF_LEADERBOARD_TOP_WORDS'), value: topWordsValue, inline: false },
                { name: language(message, 'WF_LEADERBOARD_TOP_BROKEN'), value: topBrokenValue, inline: false },
            );

        await (message.channel as TextChannel).send({ embeds: [embed] });
    }
} as CommandOptions;
