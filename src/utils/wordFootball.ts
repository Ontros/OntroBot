import { Message } from "discord.js";
import db from "../database";
import language from "../language";

const getState = db.prepare(`SELECT * FROM word_football_state WHERE guild_id = ? AND channel_id = ?`);
const updateState = db.prepare(`UPDATE word_football_state SET last_word = ?, last_user = ?, used_words = ? WHERE guild_id = ?`);
const resetState = db.prepare(`UPDATE word_football_state SET last_word = NULL, last_user = NULL, used_words = '[]' WHERE guild_id = ?`);
const checkWord = db.prepare(`SELECT 1 FROM dictionary WHERE word = ? COLLATE NOCASE`);

export const handleWordFootball = async (message: Message) => {
    if (!message.guildId || message.author.bot) return;

    const state = getState.get(message.guildId, message.channel.id) as any;
    if (!state) return;

    const word = message.content.trim().toLowerCase();

    const isSingleWord = /^[a-záčďéěíňóřšťúůýž]+$/i.test(word);
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
        const lastLetter = state.last_word.slice(-1);
        const firstLetter = word.charAt(0);
        if (lastLetter !== firstLetter) {
            isValid = false;
            failReason = `${language(message, 'WF_ERR_START')} '${lastLetter.toUpperCase()}'.`;
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
        updateState.run(word, message.author.id, JSON.stringify(usedWords), message.guildId);
        await message.react('✅');
    } else {
        resetState.run(message.guildId);
        await message.react('❌');

        const userRef = `<@${message.author.id}>`;
        const brokeText = language(message, 'WF_STREAK_BROKEN');
        const resetText = language(message, 'WF_RESET');

        //@ts-ignore
        message.channel.send(`${userRef} ${brokeText} ${failReason}\n${resetText}`);
    }
};