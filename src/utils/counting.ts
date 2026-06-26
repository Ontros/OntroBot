import { EmbedBuilder, Message, TextChannel } from "discord.js";
import db from "../database";
import language from "../language";
import serverManager from "../server-manager";
import { evaluateCount } from "./countingMath";

const getState = db.prepare(`SELECT * FROM counting_state WHERE guild_id = ? AND channel_id = ?`);
const updateState = db.prepare(`
    UPDATE counting_state
    SET current_count = ?, last_user = ?, best_count = MAX(best_count, ?), total_counts = total_counts + 1
    WHERE guild_id = ?
`);
const insertLog = db.prepare(`
    INSERT INTO counting_log (guild_id, user_id, count_value, expression, tokens, message_id, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
`);
const incrementUserSuccess = db.prepare(`
    INSERT INTO counting_user_stats (guild_id, user_id, counts_made, highest_count)
    VALUES (?, ?, 1, ?)
    ON CONFLICT(guild_id, user_id) DO UPDATE SET
        counts_made = counts_made + 1,
        highest_count = MAX(highest_count, ?)
`);
const incrementUserMistake = db.prepare(`
    INSERT INTO counting_user_stats (guild_id, user_id, mistakes)
    VALUES (?, ?, 1)
    ON CONFLICT(guild_id, user_id) DO UPDATE SET mistakes = mistakes + 1
`);
const incrementUserPadding = db.prepare(`
    INSERT INTO counting_user_stats (guild_id, user_id, padding_attempts)
    VALUES (?, ?, 1)
    ON CONFLICT(guild_id, user_id) DO UPDATE SET padding_attempts = padding_attempts + 1
`);

const MILESTONE_INTERVAL = 100;
const EPSILON = 1e-3;

function makeEmbed(title: string, description: string, color: number): EmbedBuilder {
    return new EmbedBuilder().setColor(color).setTitle(title).setDescription(description);
}

async function sendTempWarning(channel: TextChannel, embed: EmbedBuilder, delayMs = 5000): Promise<void> {
    const msg = await channel.send({ embeds: [embed] }).catch(() => null);
    if (msg) setTimeout(() => msg.delete().catch(() => { }), delayMs);
}

async function reject(message: Message, reason: string): Promise<void> {
    const channel = message.channel as TextChannel;
    await message.delete().catch(() => { });
    await sendTempWarning(channel, makeEmbed(
        language(message, 'COUNT_WARNING_TITLE'),
        `<@${message.author.id}>, ${reason}`,
        0xffa500
    ));
}

export const handleCounting = async (message: Message): Promise<void> => {
    if (!message.guildId || message.author.bot || !message.content) return;

    serverManager(message.guildId);

    const state = getState.get(message.guildId, message.channel.id) as any;
    if (!state) return;

    const serverPrefix = global.servers[message.guildId]?.prefix ?? '_';
    if (message.content.startsWith(serverPrefix)) return;
    if (message.reference || message.mentions.users.size > 0 || message.mentions.roles.size > 0) return;

    const expression = message.content.trim();
    const result = evaluateCount(expression);

    if ('error' in result) {
        if (result.lazy) {
            incrementUserPadding.run(message.guildId, message.author.id);
            await reject(message, language(message, 'COUNT_ERR_LAZY'));
        } else {
            incrementUserMistake.run(message.guildId, message.author.id);
            await reject(message, `${language(message, 'COUNT_ERR_INVALID')} ${result.error}`);
        }
        return;
    }

    const next = state.current_count + 1;
    if (!Number.isFinite(result.value) || Math.abs(result.value - next) > EPSILON) {
        incrementUserMistake.run(message.guildId, message.author.id);
        await reject(message, `${language(message, 'COUNT_ERR_WRONG')} **${next}**.`);
        return;
    }

    if (state.last_user === message.author.id) {
        await reject(message, language(message, 'COUNT_ERR_TWICE'));
        return;
    }

    insertLog.run(message.guildId, message.author.id, next, expression, result.tokens, message.id, message.createdTimestamp);
    updateState.run(next, message.author.id, next, message.guildId);
    incrementUserSuccess.run(message.guildId, message.author.id, next, next);
    await message.react('✅').catch(() => { });

    if (next % MILESTONE_INTERVAL === 0) {
        const channel = message.channel as TextChannel;
        await channel.send({
            embeds: [makeEmbed(
                language(message, 'COUNT_MILESTONE_TITLE'),
                `**${next}** ${language(message, 'COUNT_MILESTONE')}`,
                0x0099ff
            )]
        }).catch(() => { });
    }
};
