import { EmbedBuilder, Message, SlashCommandBuilder, TextChannel } from "discord.js";
import { CommandOptions } from "../../types";
import db from "../../database";
import language, { languageI } from "../../language";

const getLeaderboard = db.prepare(`
    SELECT user_id, successful_words, total_word_length, streaks_broken
    FROM user_wf_stats
    ORDER BY successful_words DESC
    LIMIT 10
`);


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
        const rows = getLeaderboard.all() as any[];

        const embed = new EmbedBuilder()
            .setColor(0xffd700)
            .setTitle(languageI(interaction, 'WF_LEADERBOARD_TITLE'));

        if (rows.length === 0) {
            embed.setDescription(languageI(interaction, 'WF_LEADERBOARD_EMPTY'));
        } else {
            const lines = await Promise.all(rows.map(async (row, i) => {
                const user = await interaction.client.users.fetch(row.user_id).catch(() => null);
                const name = user ? user.username : `<@${row.user_id}>`;
                const wordsLabel = languageI(interaction, 'WF_LEADERBOARD_WORDS');
                const brokenLabel = languageI(interaction, 'WF_LEADERBOARD_BROKEN');
                return `${name} — ${row.successful_words} ${wordsLabel} (${row.streaks_broken} ${brokenLabel})`;
            }));
            embed.setDescription(lines.join('\n'));
        }

        await interaction.reply({ embeds: [embed] });
    },
    callback: async (message: Message) => {
        const rows = getLeaderboard.all() as any[];

        const embed = new EmbedBuilder()
            .setColor(0xffd700)
            .setTitle(language(message, 'WF_LEADERBOARD_TITLE'));

        if (rows.length === 0) {
            embed.setDescription(language(message, 'WF_LEADERBOARD_EMPTY'));
        } else {
            const lines = await Promise.all(rows.map(async (row, i) => {
                const user = await message.client.users.fetch(row.user_id).catch(() => null);
                const name = user ? user.username : `<@${row.user_id}>`;
                const wordsLabel = language(message, 'WF_LEADERBOARD_WORDS');
                const brokenLabel = language(message, 'WF_LEADERBOARD_BROKEN');
                return `${name} — ${row.successful_words} ${wordsLabel} (${row.streaks_broken} ${brokenLabel})`;
            }));
            embed.setDescription(lines.join('\n'));
        }

        await (message.channel as TextChannel).send({ embeds: [embed] });
    }
} as CommandOptions;
