import { EmbedBuilder, Message, SlashCommandBuilder, TextChannel } from "discord.js";
import { CommandOptions } from "../../types";
import db from "../../database";
import language, { languageI } from "../../language";
import getUser from "../../utils/getUser";

const getTopCounters = db.prepare(`
    SELECT user_id, counts_made
    FROM counting_user_stats
    WHERE guild_id = ?
    ORDER BY counts_made DESC
    LIMIT 5
`);

const getTopComplex = db.prepare(`
    SELECT user_id, expression, tokens
    FROM counting_log
    WHERE guild_id = ?
    ORDER BY tokens DESC, id ASC
    LIMIT 3
`);

const getCountState = db.prepare(`
    SELECT current_count, best_count, total_counts
    FROM counting_state
    WHERE guild_id = ?
`);

const getUserCountStats = db.prepare(`
    SELECT counts_made, highest_count, mistakes, padding_attempts
    FROM counting_user_stats
    WHERE guild_id = ? AND user_id = ?
`);

const getUserTokens = db.prepare(`
    SELECT COALESCE(SUM(tokens), 0) AS total, COALESCE(MAX(tokens), 0) AS max
    FROM counting_log
    WHERE guild_id = ? AND user_id = ?
`);

async function buildTopCountersField(guildId: string, client: any, countsLabel: string): Promise<string> {
    const rows = getTopCounters.all(guildId) as any[];
    if (rows.length === 0) return '-';
    const lines = await Promise.all(rows.map(async (row, i) => {
        const user = await client.users.fetch(row.user_id).catch(() => null);
        const name = user ? user.username : `<@${row.user_id}>`;
        return `${i + 1}. ${name} — **${row.counts_made}** ${countsLabel}`;
    }));
    return lines.join('\n');
}

async function buildTopComplexField(guildId: string, client: any, noneLabel: string): Promise<string> {
    const rows = getTopComplex.all(guildId) as any[];
    if (rows.length === 0) return noneLabel;
    const lines = await Promise.all(rows.map(async (row, i) => {
        const user = await client.users.fetch(row.user_id).catch(() => null);
        const name = user ? user.username : `<@${row.user_id}>`;
        return `${i + 1}. \`${row.expression}\` — **${row.tokens}** (${name})`;
    }));
    return lines.join('\n');
}

function buildUserStatsEmbed(
    guildId: string,
    userId: string,
    username: string,
    labels: {
        title: string; counts: string; highest: string; totalTokens: string;
        maxTokens: string; accuracy: string; padding: string; none: string;
    },
): EmbedBuilder {
    const row = getUserCountStats.get(guildId, userId) as any;
    if (!row) {
        return new EmbedBuilder().setColor(0x0099ff).setTitle(`${labels.title} — ${username}`).setDescription(labels.none);
    }
    const tokens = getUserTokens.get(guildId, userId) as any;
    const attempts = row.counts_made + row.mistakes;
    const accuracy = attempts > 0 ? ((row.counts_made / attempts) * 100).toFixed(1) : '100.0';
    return new EmbedBuilder()
        .setColor(0x0099ff)
        .setTitle(`${labels.title} — ${username}`)
        .addFields(
            { name: labels.counts, value: `**${row.counts_made}**`, inline: true },
            { name: labels.highest, value: `**${row.highest_count}**`, inline: true },
            { name: labels.totalTokens, value: `**${tokens.total}**`, inline: true },
            { name: labels.maxTokens, value: `**${tokens.max}**`, inline: true },
            { name: labels.accuracy, value: `**${accuracy}%**`, inline: true },
            { name: labels.padding, value: `**${row.padding_attempts}**`, inline: true },
        );
}

function userLabels(get: (key: any) => string) {
    return {
        title: get('COUNT_USER_TITLE'),
        counts: get('COUNT_USER_COUNTS'),
        highest: get('COUNT_USER_HIGHEST'),
        totalTokens: get('COUNT_USER_TOTAL_TOKENS'),
        maxTokens: get('COUNT_USER_MAX_TOKENS'),
        accuracy: get('COUNT_USER_ACCURACY'),
        padding: get('COUNT_USER_PADDING'),
        none: get('COUNT_USER_NONE'),
    };
}

export default {
    commands: ['countingleaderboard', 'clb'],
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
            .setDescription('Show counting stats for a specific user')
            .setDescriptionLocalizations({ 'cs': 'Zobrazí statistiky počítání konkrétního uživatele' })
    ),
    execute: async (interaction) => {
        if (!interaction.guildId) return;
        const get = (key: any) => languageI(interaction, key);

        const targetUser = interaction.options.get('user')?.user;
        if (targetUser) {
            const embed = buildUserStatsEmbed(interaction.guildId, targetUser.id, targetUser.username, userLabels(get));
            await interaction.reply({ embeds: [embed] });
            return;
        }

        const [topValue, complexValue] = await Promise.all([
            buildTopCountersField(interaction.guildId, interaction.client, get('COUNT_LB_COUNTS')),
            buildTopComplexField(interaction.guildId, interaction.client, get('COUNT_LB_RECORD_NONE')),
        ]);

        const stateRow = getCountState.get(interaction.guildId) as any;

        const embed = new EmbedBuilder()
            .setColor(0x0099ff)
            .setTitle(get('COUNT_LB_TITLE'))
            .addFields(
                { name: get('COUNT_LB_CURRENT'), value: `**${stateRow?.current_count ?? 0}**`, inline: true },
                { name: get('COUNT_LB_BEST'), value: `**${stateRow?.best_count ?? 0}**`, inline: true },
                { name: get('COUNT_LB_TOTAL'), value: `**${stateRow?.total_counts ?? 0}**`, inline: true },
                { name: get('COUNT_LB_RECORD'), value: complexValue, inline: false },
                { name: get('COUNT_LB_TOP'), value: topValue, inline: false },
            );

        await interaction.reply({ embeds: [embed] });
    },
    callback: async (message: Message, args: string[]) => {
        if (!message.guildId) return;
        const get = (key: any) => language(message, key);

        if (args[0]) {
            const resolved = await getUser(message, args[0]);
            if (!resolved) {
                await (message.channel as TextChannel).send(language(message, 'INPUT_ERR_HALT'));
                return;
            }
            const target = resolved.user;
            const embed = buildUserStatsEmbed(message.guildId, target.id, target.username, userLabels(get));
            await (message.channel as TextChannel).send({ embeds: [embed] });
            return;
        }

        const [topValue, complexValue] = await Promise.all([
            buildTopCountersField(message.guildId, message.client, get('COUNT_LB_COUNTS')),
            buildTopComplexField(message.guildId, message.client, get('COUNT_LB_RECORD_NONE')),
        ]);

        const stateRow = getCountState.get(message.guildId) as any;

        const embed = new EmbedBuilder()
            .setColor(0x0099ff)
            .setTitle(get('COUNT_LB_TITLE'))
            .addFields(
                { name: get('COUNT_LB_CURRENT'), value: `**${stateRow?.current_count ?? 0}**`, inline: true },
                { name: get('COUNT_LB_BEST'), value: `**${stateRow?.best_count ?? 0}**`, inline: true },
                { name: get('COUNT_LB_TOTAL'), value: `**${stateRow?.total_counts ?? 0}**`, inline: true },
                { name: get('COUNT_LB_RECORD'), value: complexValue, inline: false },
                { name: get('COUNT_LB_TOP'), value: topValue, inline: false },
            );

        await (message.channel as TextChannel).send({ embeds: [embed] });
    }
} as CommandOptions;
