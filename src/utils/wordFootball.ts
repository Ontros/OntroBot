import { EmbedBuilder, Message, MessageReaction, PartialMessage, PartialMessageReaction, PartialUser, TextChannel, User } from "discord.js";
import db from "../database";
import language from "../language";
import { noServer } from "../language";
import serverManager from "../server-manager";

export const STARS_TO_ADD_WORD = 4;
export const GRACE_PERIOD_SECONDS = 5;

interface GraceEntry { prevWord: string; timestamp: number; }
const graceMemory = new Map<string, GraceEntry>();
const lastWordMessageId = new Map<string, string>();
const hintMessages = new Map<string, string>();

const getState = db.prepare(`SELECT * FROM word_football_state WHERE guild_id = ? AND channel_id = ?`);
const updateState = db.prepare(`
    UPDATE word_football_state
    SET last_word = ?, last_user = ?, used_words = ?,
        streak_length = streak_length + 1,
        best_streak = MAX(best_streak, streak_length + 1)
    WHERE guild_id = ?
`);
const updateStateGrace = db.prepare(`
    UPDATE word_football_state
    SET used_words = ?
    WHERE guild_id = ?
`);
const resetState = db.prepare(`
    UPDATE word_football_state
    SET last_word = NULL, last_user = NULL, used_words = '[]', streak_length = 0
    WHERE guild_id = ?
`);
const checkWord = db.prepare(`SELECT 1 FROM dictionary WHERE word = ? COLLATE NOCASE`);
const addWordToDict = db.prepare(`INSERT OR IGNORE INTO dictionary (word) VALUES (?)`);

const incrementSuccess = db.prepare(`
    INSERT INTO user_wf_stats (guild_id, user_id, successful_words, total_word_length)
    VALUES (?, ?, 1, ?)
    ON CONFLICT(guild_id, user_id) DO UPDATE SET
        successful_words = successful_words + 1,
        total_word_length = total_word_length + ?
`);
const incrementWordUse = db.prepare(`
    INSERT INTO wf_word_stats (guild_id, user_id, word, count)
    VALUES (?, ?, ?, 1)
    ON CONFLICT(guild_id, user_id, word) DO UPDATE SET
        count = count + 1
`);
const checkWordUsed = db.prepare(`SELECT 1 FROM wf_word_stats WHERE guild_id = ? AND word = ? LIMIT 1`);
const recordWordFirst = db.prepare(`INSERT OR IGNORE INTO wf_word_first (guild_id, word, user_id, first_ts) VALUES (?, ?, ?, ?)`);
const incrementBroken = db.prepare(`
    INSERT INTO user_wf_stats (guild_id, user_id, streaks_broken)
    VALUES (?, ?, 1)
    ON CONFLICT(guild_id, user_id) DO UPDATE SET
        streaks_broken = streaks_broken + 1
`);

const MAX_HISTORY = 1000;
export const WORD_REGEX = /^[a-záčďéěíňóřšťúůýžäĺľôŕ]+$/i;

const VOWEL_GROUPS: Record<string, string[]> = {
    'a': ['a', 'á', 'ä'], 'á': ['a', 'á', 'ä'], 'ä': ['a', 'á', 'ä'],
    'e': ['e', 'é', 'ě'], 'é': ['e', 'é', 'ě'], 'ě': ['e', 'é', 'ě'],
    'i': ['i', 'í'], 'í': ['i', 'í'],
    'o': ['o', 'ó', 'ô'], 'ó': ['o', 'ó', 'ô'], 'ô': ['o', 'ó', 'ô'],
    'u': ['u', 'ú', 'ů'], 'ú': ['u', 'ú', 'ů'], 'ů': ['u', 'ú', 'ů'],
    'y': ['y', 'ý'], 'ý': ['y', 'ý'],
};

function lettersMatch(lastLetter: string, firstLetter: string): boolean {
    if (lastLetter === firstLetter) return true;
    const group = VOWEL_GROUPS[lastLetter];
    return group ? group.includes(firstLetter) : false;
}

function nextWordStartStr(lastWord: string): string {
    if (lastWord.endsWith('ch')) return "'CH' nebo 'H'";
    const lastChar = lastWord.slice(-1).toLowerCase();
    if (lastChar === 'ď') return "'Ď', 'DI' nebo 'DÍ'";
    if (lastChar === 'ť') return "'Ť', 'TI' nebo 'TÍ'";
    if (lastChar === 'ň') return "'Ň', 'NI' nebo 'NÍ'";
    if (lastChar === 'ĺ' || lastChar === 'ľ') return "'L', 'Ĺ' nebo 'Ľ'";
    return allowedLettersStr(lastChar);
}

function wordLetterMatch(prevWord: string, nextWord: string): boolean {
    const lastChar = prevWord.slice(-1).toLowerCase();
    const word = nextWord.toLowerCase();
    if (prevWord.endsWith('ch')) return word.startsWith('ch') || word.startsWith('h');
    if (lastChar === 'ď') return word.startsWith('ď') || word.startsWith('di') || word.startsWith('dí');
    if (lastChar === 'ť') return word.startsWith('ť') || word.startsWith('ti') || word.startsWith('tí');
    if (lastChar === 'ň') return word.startsWith('ň') || word.startsWith('ni') || word.startsWith('ní');
    if (lastChar === 'ĺ' || lastChar === 'ľ') return word.startsWith('l') || word.startsWith('ĺ') || word.startsWith('ľ');
    return lettersMatch(lastChar, word.charAt(0));
}

function allowedLettersStr(lastLetter: string): string {
    const group = VOWEL_GROUPS[lastLetter];
    return group
        ? group.map(l => `'${l.toUpperCase()}'`).join('/')
        : `'${lastLetter.toUpperCase()}'`;
}

function makeEmbed(title: string, description: string, color: number): EmbedBuilder {
    return new EmbedBuilder().setColor(color).setTitle(title).setDescription(description);
}

async function sendTempWarning(channel: TextChannel, embed: EmbedBuilder, delayMs = 5000): Promise<void> {
    const msg = await channel.send({ embeds: [embed] }).catch(() => null);
    if (msg) setTimeout(() => msg.delete().catch(() => { }), delayMs);
}

export const handleWordFootball = async (message: Message): Promise<void> => {
    if (!message.guildId || message.author.bot || !message.content) return;

    serverManager(message.guildId);

    const state = getState.get(message.guildId, message.channel.id) as any;
    if (!state) return;

    const serverPrefix = global.servers[message.guildId]?.prefix ?? '_';
    if (message.content.startsWith(serverPrefix)) return;

    if (message.reference || message.mentions.users.size > 0 || message.mentions.roles.size > 0) return;

    const channel = message.channel as TextChannel;
    const words = message.content.trim().split(/\s+/);

    if (words.length > 1) {
        await message.delete().catch(() => { });
        await sendTempWarning(channel, makeEmbed(
            language(message, 'WF_WARNING_TITLE'),
            `<@${message.author.id}>, ${language(message, 'WF_ONE_WORD_ONLY')}`,
            0xffa500
        ));
        return;
    }

    const word = words[0].toLowerCase();
    const isSingleWord = WORD_REGEX.test(word);
    const usedWords: string[] = JSON.parse(state.used_words || '[]');

    if (isSingleWord && usedWords.includes(word)) {
        await message.delete().catch(() => { });
        await sendTempWarning(channel, makeEmbed(
            language(message, 'WF_WARNING_TITLE'),
            `<@${message.author.id}>, ${language(message, 'WF_REPEAT_WORD')}`,
            0xffa500
        ));
        return;
    }

    if (state.last_user === message.author.id) {
        await message.delete().catch(() => { });
        await sendTempWarning(channel, makeEmbed(
            language(message, 'WF_WARNING_TITLE'),
            `<@${message.author.id}>, ${language(message, 'WF_ERR_TWICE')}`,
            0xffa500
        ));
        return;
    }

    let isValid = true;
    let letterCheckFailed = false;
    let failReason = "";

    if (!isSingleWord) {
        isValid = false;
        failReason = language(message, 'WF_ERR_SINGLE');
    } else if (state.last_word) {
        if (!wordLetterMatch(state.last_word, word)) {
            isValid = false;
            letterCheckFailed = true;
            failReason = `${language(message, 'WF_ERR_START')} ${nextWordStartStr(state.last_word)}.`;
        }
    }

    if (isValid) {
        const dictCheck = checkWord.get(word);
        if (!dictCheck) {
            isValid = false;
            failReason = language(message, 'WF_ERR_DICT');
        }
    }

    const graceKey = `${message.guildId}:${message.channel.id}`;

    const oldHintId = hintMessages.get(graceKey);
    if (oldHintId) {
        channel.messages.fetch(oldHintId).then(m => m.delete().catch(() => { })).catch(() => { });
        hintMessages.delete(graceKey);
    }

    let graceActive = false;
    let graceAgeSeconds = 0;

    if (!isValid && letterCheckFailed) {
        const grace = graceMemory.get(graceKey);
        if (grace) {
            const ageSeconds = Math.floor(message.createdTimestamp / 1000) - grace.timestamp;
            if (ageSeconds <= GRACE_PERIOD_SECONDS && wordLetterMatch(grace.prevWord, word) && checkWord.get(word)) {
                isValid = true;
                graceActive = true;
                graceAgeSeconds = ageSeconds;
            }
        }
    }

    if (isValid) {
        usedWords.push(word);
        if (usedWords.length > MAX_HISTORY) usedWords.shift();

        const prevStreakLength = state.streak_length ?? 0;
        const prevBestStreak = state.best_streak ?? 0;
        const newStreakLength = prevStreakLength + 1;

        if (graceActive) {
            updateStateGrace.run(JSON.stringify(usedWords), message.guildId);
        } else {
            graceMemory.set(graceKey, { prevWord: state.last_word ?? word, timestamp: Math.floor(message.createdTimestamp / 1000) });
            lastWordMessageId.set(graceKey, message.id);
            updateState.run(word, message.author.id, JSON.stringify(usedWords), message.guildId);
        }
        const wasNewWord = !checkWordUsed.get(message.guildId, word);
        incrementSuccess.run(message.guildId, message.author.id, word.length, word.length);
        incrementWordUse.run(message.guildId, message.author.id, word);
        if (wasNewWord) recordWordFirst.run(message.guildId, word, message.author.id, message.createdTimestamp);

        if (graceActive) {
            await message.react('⚠️');
            const nextLetters = state.last_word ? nextWordStartStr(state.last_word) : '?';
            const luckyEmbed = makeEmbed(
                language(message, 'WF_GRACE_TITLE'),
                `<@${message.author.id}> ${language(message, 'WF_GRACE_SAVED')} ${GRACE_PERIOD_SECONDS}s\n${language(message, 'WF_NEXT_STARTS_WITH')} ${nextLetters}`,
                0xffa500
            );
            const luckyMsg = await channel.send({ embeds: [luckyEmbed] }).catch(() => null);
            if (luckyMsg && state.last_word) {
                const lastChar = state.last_word.slice(-1).toLowerCase();
                if (state.last_word.endsWith('ch') || ['ď', 'ť', 'ň', 'ĺ', 'ľ'].includes(lastChar)) {
                    hintMessages.set(graceKey, luckyMsg.id);
                }
            }
        } else {
            await message.react('✅');
            const lastChar = word.slice(-1).toLowerCase();
            const isSpecial = word.endsWith('ch') || ['ď', 'ť', 'ň', 'ĺ', 'ľ'].includes(lastChar);
            if (isSpecial) {
                const nextLetters = nextWordStartStr(word);
                const hintEmbed = makeEmbed(
                    language(message, 'WF_WARNING_TITLE'),
                    `${language(message, 'WF_NEXT_STARTS_WITH')} ${nextLetters}`,
                    0x3498db
                );
                const hintMsg = await channel.send({ embeds: [hintEmbed] }).catch(() => null);
                if (hintMsg) hintMessages.set(graceKey, hintMsg.id);
            }
        }

        if (wasNewWord) await message.react('🤯').catch(() => { });

        if (newStreakLength % 25 === 0) {
            const isRecord = newStreakLength > prevBestStreak;
            const desc = isRecord
                ? `**${newStreakLength}** ${language(message, 'WF_LEADERBOARD_WORDS')} — ${language(message, 'WF_STREAK_NEW_RECORD')}`
                : `**${newStreakLength}** ${language(message, 'WF_LEADERBOARD_WORDS')}`;
            await channel.send({ embeds: [makeEmbed(language(message, 'WF_STREAK_MILESTONE'), desc, 0x0099ff)] });
        }
    } else {
        const streakLength = state.streak_length ?? 0;

        graceMemory.delete(graceKey);
        lastWordMessageId.delete(graceKey);
        resetState.run(message.guildId);
        incrementBroken.run(message.guildId, message.author.id);
        await message.react('❌');

        let timeoutText = "";
        if (message.member) {
            try {
                if (message.member.moderatable) {
                    await message.member.timeout(60 * 1000, language(message, 'WF_TIMEOUT_MESSAGE'));
                    timeoutText = language(message, 'WF_TIMEOUT_SUCCESS');
                } else {
                    timeoutText = language(message, 'WF_TIMEOUT_FAIL');
                }
            } catch {
                timeoutText = language(message, 'WF_TIMEOUT_FAIL');
            }
        }

        const streakPart = streakLength > 0
            ? ` (**${streakLength}** ${language(message, 'WF_LEADERBOARD_WORDS')})`
            : '';
        const lines = [
            `<@${message.author.id}> ${language(message, 'WF_STREAK_BROKEN')}${streakPart}. **${failReason}**`,
            timeoutText,
            language(message, 'WF_RESET'),
        ].filter(Boolean);

        await channel.send({ embeds: [makeEmbed(language(message, 'WF_BROKEN_TITLE'), lines.join('\n'), 0xff0000)] });
    }
};

export const handleWFMessageUpdate = async (
    _oldMessage: Message | PartialMessage,
    newMessage: Message | PartialMessage
): Promise<void> => {
    if (!newMessage.guildId) return;

    const graceKey = `${newMessage.guildId}:${newMessage.channelId}`;
    if (lastWordMessageId.get(graceKey) !== newMessage.id) return;

    const state = getState.get(newMessage.guildId, newMessage.channelId) as any;
    if (!state) return;

    serverManager(newMessage.guildId);
    const lang = global.servers[newMessage.guildId]?.language ?? 'english';
    const nextLetters = state.last_word ? nextWordStartStr(state.last_word) : '?';

    const authorId = newMessage.author?.id ?? (newMessage.partial ? (await newMessage.fetch().catch(() => null))?.author?.id : null);
    const mention = authorId ? `<@${authorId}>` : 'Někdo';

    const embed = makeEmbed(
        noServer(lang, 'WF_EDITOR_TITLE'),
        `${mention} ${noServer(lang, 'WF_EDITOR_MSG')} ${noServer(lang, 'WF_NEXT_STARTS_WITH')} ${nextLetters}`,
        0xff6600
    );
    await (newMessage.channel as TextChannel).send({ embeds: [embed] }).catch(() => { });
};

export const handleWFReaction = async (
    reaction: MessageReaction | PartialMessageReaction,
    user: User | PartialUser
): Promise<void> => {
    if (user.bot) return;
    if (reaction.emoji.name !== '⭐') return;
    if (!reaction.message.guildId) return;

    const state = getState.get(reaction.message.guildId, reaction.message.channelId) as any;
    if (!state) return;

    const fullReaction = reaction.partial ? await reaction.fetch().catch(() => null) : reaction;
    if (!fullReaction) return;

    const guild = reaction.message.guild;
    const member = guild ? await guild.members.fetch(user.id).catch(() => null) : null;
    const hasManageRoles = member?.permissions.has('ManageRoles') ?? false;

    if (!hasManageRoles && (fullReaction.count ?? 0) < STARS_TO_ADD_WORD) return;

    const fullMessage = reaction.message.partial
        ? await reaction.message.fetch().catch(() => null)
        : reaction.message;
    if (!fullMessage) return;

    const word = fullMessage.content?.trim().toLowerCase();
    if (!word || !WORD_REGEX.test(word)) return;

    if (checkWord.get(word)) return;

    addWordToDict.run(word);

    serverManager(reaction.message.guildId);
    const lang = global.servers[reaction.message.guildId]?.language ?? 'english';

    const embed = makeEmbed(
        `${noServer(lang, 'WF_DICT_ADD_TITLE')}`,
        `**${word}** ${noServer(lang, 'WF_DICT_ADD')}`,
        0xffd700
    );
    await (fullMessage.channel as TextChannel).send({ embeds: [embed] }).catch(() => { });
};
