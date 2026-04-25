import { Message } from "discord.js";
import db from "../database";
import language from "../language";
import serverManager from "../server-manager";

const getState = db.prepare(`SELECT * FROM word_football_state WHERE guild_id = ? AND channel_id = ?`);
const updateState = db.prepare(`UPDATE word_football_state SET last_word = ?, last_user = ?, used_words = ? WHERE guild_id = ?`);
const resetState = db.prepare(`UPDATE word_football_state SET last_word = NULL, last_user = NULL, used_words = '[]' WHERE guild_id = ?`);
const checkWord = db.prepare(`SELECT 1 FROM dictionary WHERE word = ? COLLATE NOCASE`);

const incrementSuccess = db.prepare(`INSERT INTO user_wf_stats (user_id, successful_words, total_word_length) VALUES (?, 1, ?) ON CONFLICT(user_id) DO UPDATE SET successful_words = successful_words + 1, total_word_length = total_word_length + ?`);
const incrementBroken = db.prepare(`INSERT INTO user_wf_stats (user_id, streaks_broken) VALUES (?, 1) ON CONFLICT(user_id) DO UPDATE SET streaks_broken = streaks_broken + 1`);

const MAX_HISTORY = 1000;

export const handleWordFootball = async (message: Message) => {
    if (!message.guildId || message.author.bot) return;

    serverManager(message.guildId);

    const state = getState.get(message.guildId, message.channel.id) as any;
    if (!state) return;

    if (message.reference || message.mentions.users.size > 0 || message.mentions.roles.size > 0) return;

    const words = message.content.trim().split(/\s+/);
    if (words.length > 1) {
        await message.delete().catch(() => { });

        //@ts-ignore
        const warningMessage = await message.channel.send(`<@${message.author.id}>, ${language(message, 'WF_ONE_WORD_ONLY')}`).catch(() => null);

        if (warningMessage) {
            setTimeout(() => {
                warningMessage.delete().catch(() => { });
            }, 5000);
        }
        return;
    }

    const word = words[0].toLowerCase();
    const isSingleWord = /^[a-záčďéěíňóřšťúůýžäĺľôŕ]+$/i.test(word);
    const usedWords = JSON.parse(state.used_words || '[]');

    let isValid = true;
    let failReason = "";

    if (!isSingleWord) {
        isValid = false;
        failReason = language(message, 'WF_ERR_SINGLE');
    } else if (state.last_user === message.author.id) {
        isValid = false;
        failReason = language(message, 'WF_ERR_TWICE');
    } else if (state.last_word) {
        const lastIsCh = state.last_word.endsWith('ch');
        const startsWithCh = word.startsWith('ch');
        const startsWithH = word.startsWith('h');

        const lastLetter = lastIsCh ? 'ch' : state.last_word.slice(-1);
        const firstLetter = startsWithCh ? 'ch' : word.charAt(0);

        if (lastIsCh) {
            if (!startsWithCh && !startsWithH) {
                isValid = false;
                failReason = `${language(message, 'WF_ERR_START')} 'CH' nebo 'H'.`;
            }
        } else {
            if (lastLetter !== firstLetter) {
                isValid = false;
                failReason = `${language(message, 'WF_ERR_START')} '${lastLetter.toUpperCase()}'.`;
            }
        }
    }

    if (isValid && usedWords.includes(word)) {
        isValid = false;
        failReason = language(message, 'WF_ERR_USED');
    }

    if (isValid) {
        const dictCheck = checkWord.get(word);
        if (!dictCheck) {
            isValid = false;
            failReason = language(message, 'WF_ERR_DICT');
        }
    }

    if (isValid) {
        usedWords.push(word);
        if (usedWords.length > MAX_HISTORY) {
            usedWords.shift();
        }

        updateState.run(word, message.author.id, JSON.stringify(usedWords), message.guildId);
        incrementSuccess.run(message.author.id, word.length, word.length);

        await message.react('✅');
    } else {
        resetState.run(message.guildId);
        incrementBroken.run(message.author.id);

        await message.react('❌');

        const userRef = `<@${message.author.id}>`;
        const brokeText = language(message, 'WF_STREAK_BROKEN');
        const resetText = language(message, 'WF_RESET');
        let timeoutText = "";

        if (message.member) {
            try {
                if (message.member.moderatable) {
                    await message.member.timeout(60 * 1000, language(message, 'WF_TIMEOUT_MESSAGE'));
                    timeoutText = language(message, 'WF_TIMEOUT_SUCCESS');
                } else {
                    timeoutText = language(message, 'WF_TIMEOUT_FAIL');
                }
            } catch (error) {
                console.error("Failed to timeout member:", error);
                timeoutText = language(message, 'WF_TIMEOUT_FAIL');
            }
        }

        //@ts-ignore
        message.channel.send(`${userRef} ${brokeText} ${failReason}\n${timeoutText}\n${resetText}`);
    }
};