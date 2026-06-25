import { Collection, Message, TextChannel } from "discord.js";
import db from "../database";
import { WORD_REGEX } from "./wordFootball";

const getWfChannel = db.prepare(`SELECT channel_id FROM word_football_state WHERE guild_id = ?`);
const wordExists = db.prepare(`SELECT 1 FROM wf_word_stats WHERE guild_id = ? AND word = ? LIMIT 1`);
const incrementWordUse = db.prepare(`
    INSERT INTO wf_word_stats (guild_id, user_id, word, count)
    VALUES (?, ?, ?, 1)
    ON CONFLICT(guild_id, user_id, word) DO UPDATE SET count = count + 1
`);

// Self-throttle below Discord's limits: global 50 req/s, and the add-reaction
// route allows ~1 per 250ms. We never rely on hitting 429s (10k invalid
// requests / 10 min triggers a temporary IP ban).
const FETCH_PAGE_DELAY_MS = 400;
const REACTION_DELAY_MS = 300;

const sleep = (ms: number) => new Promise(res => setTimeout(res, ms));

interface Candidate { msg: Message; word: string; }

export async function runWfMigration(message: Message, guildId: string, lastMessageId: string): Promise<void> {
    const row = getWfChannel.get(guildId) as { channel_id: string } | undefined;
    if (!row?.channel_id) {
        await message.reply(`No word football channel configured for guild ${guildId}`);
        return;
    }

    const channel = await global.bot.channels.fetch(row.channel_id).catch(() => null);
    if (!channel || !channel.isTextBased()) {
        await message.reply(`Channel ${row.channel_id} not found or not text based`);
        return;
    }
    const textChannel = channel as TextChannel;

    const status = await message.reply(`Starting WF migration for guild ${guildId} in <#${row.channel_id}>…`);

    // 1. Page backwards through history. The fetched payload already carries each
    // reaction's `me` flag, so the bot-✅ check costs no extra API calls.
    const candidates: Candidate[] = [];
    let before: string | undefined = lastMessageId;
    let scanned = 0;
    let pages = 0;

    while (true) {
        const batch: Collection<string, Message<true>> | null =
            await textChannel.messages.fetch({ limit: 100, before }).catch(() => null);
        if (!batch || batch.size === 0) break;

        for (const msg of batch.values()) {
            scanned++;
            if (msg.author.bot) continue;
            const hasBotCheck = msg.reactions.cache.some(r => r.emoji.name === '✅' && r.me);
            if (!hasBotCheck) continue;
            const content = msg.content.trim();
            if (/\s/.test(content)) continue;
            const word = content.toLowerCase();
            if (!WORD_REGEX.test(word)) continue;
            candidates.push({ msg, word });
        }

        before = batch.last()!.id;
        pages++;
        if (pages % 5 === 0) {
            await status.edit(`Scanning… ${scanned} messages, ${candidates.length} valid words so far`).catch(() => { });
        }
        if (batch.size < 100) break;
        await sleep(FETCH_PAGE_DELAY_MS);
    }

    // 2. Oldest -> newest so the FIRST play of each word is the one flagged "new".
    candidates.sort((a, b) => a.msg.createdTimestamp - b.msg.createdTimestamp);

    const seen = new Set<string>();
    const newWordMsgs: Message[] = [];
    for (const c of candidates) {
        if (!seen.has(c.word) && !wordExists.get(guildId, c.word)) newWordMsgs.push(c.msg);
        seen.add(c.word);
    }

    const write = db.transaction((rows: Candidate[]) => {
        for (const r of rows) incrementWordUse.run(guildId, r.msg.author.id, r.word);
    });
    write(candidates);

    await status.edit(
        `Recorded ${candidates.length} word plays (${seen.size} distinct, ${newWordMsgs.length} new). ` +
        `Adding 🤯 to new words (throttled)…`
    ).catch(() => { });

    // 3. React 🤯 on first-seen words, sequential + delayed for the reaction route.
    let reacted = 0;
    for (const msg of newWordMsgs) {
        await msg.react('🤯').catch(() => { });
        reacted++;
        if (reacted % 25 === 0) {
            await status.edit(`Adding 🤯… ${reacted}/${newWordMsgs.length}`).catch(() => { });
        }
        await sleep(REACTION_DELAY_MS);
    }

    await status.edit(
        `WF migration done. Scanned ${scanned} messages, recorded ${candidates.length} plays ` +
        `(${seen.size} distinct words), added 🤯 to ${reacted} new words.`
    ).catch(() => { });
}
