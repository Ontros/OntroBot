import { CollectorFilter, EmbedField, Message, MessageReaction, User } from "discord.js"
import { ReactionFormOption, ReactionFormOutput } from "../types"

module.exports = async (userMessage: Message, botMessage: (Message), title: string, question: string, formOptions: ReactionFormOption[]) => {
    if (!userMessage.guild) { return }
    const { Discord, bot, lang } = global
    if (!bot.user) { return }
    const avatarURL = bot.user.avatarURL()
    if (!avatarURL) { userMessage.channel.send(lang(userMessage.guild.id, 'ERR_AVATAR')); return }
    if (question.length > 256) {
        console.error('Question too long ' + question)
        return
    }

    //generate embed:
    var options = ''
    const reactions: string[] = []
    for (var i = 0; i < formOptions.length; i++) {
        const reaction = emojiNumbers[i]
        options += `${reaction} - ${formOptions[i].title}\n\n`
        reactions.push(reaction)
    }

    const field: EmbedField[] = [];
    field[0] = { name: question, value: options, inline: false };
    const embed = global.createEmbed(userMessage, title, null, field)

    //send/edit embed:
    if (!botMessage) {
        botMessage = await userMessage.channel.send(embed)
        if (!botMessage) { console.error('message sending'); return }
    }
    else {
        botMessage.edit(embed)
    }

    //add missing reactions
    const reactionsFiltered = reactions.filter((react) => { return !botMessage.reactions.cache.has(react) })
    addReactions(botMessage, reactionsFiltered)

    const filter: CollectorFilter = (reaction: MessageReaction, user: User) => {
        return reactions.includes(reaction.emoji.name) && user.id === userMessage.author.id
    }
    await botMessage.fetch()
    // console.log('awaiting')

    const collection = await botMessage.awaitReactions(filter, { max: 1 })

    //author reacted:
    const react = collection.first()
    if (!react) { console.log("react error"); return }
    react.users.remove(userMessage.author)

    //Get callback number
    const callNum = emojiNumbers.indexOf(react.emoji.name)
    if (!formOptions[callNum].callback) {
        const output: ReactionFormOutput = {
            id: callNum,
            userMessage,
            botMessage,
            formOption: formOptions[callNum]
        }
        return output
    }
    formOptions[callNum].callback?.(userMessage, botMessage, react)
    return null
}

const addReactions = async (message: Message, reactions: string[]) => {
    try {
        if (reactions.length > 0) {
            await message.react(reactions[0])
            reactions.shift()
        }
        if (reactions.length > 0) {
            //setTimeout(() => addReactions(message, reactions),750)
            await addReactions(message, reactions)
        }
    }
    catch (err) {
        return
    }
}

const emojiNumbers = [
    '1⃣', '2⃣', '3⃣', '4⃣', '5⃣', '6⃣', '7⃣', '8⃣', '9⃣', '🔟'
]

const emoji = {
    a: '🇦', b: '🇧', c: '🇨', d: '🇩',
    e: '🇪', f: '🇫', g: '🇬', h: '🇭',
    i: '🇮', j: '🇯', k: '🇰', l: '🇱',
    m: '🇲', n: '🇳', o: '🇴', p: '🇵',
    q: '🇶', r: '🇷', s: '🇸', t: '🇹',
    u: '🇺', v: '🇻', w: '🇼', x: '🇽',
    y: '🇾', z: '🇿', 0: '0⃣', 1: '1⃣',
    2: '2⃣', 3: '3⃣', 4: '4⃣', 5: '5⃣',
    6: '6⃣', 7: '7⃣', 8: '8⃣', 9: '9⃣',
    10: '🔟', '#': '#⃣', '*': '*⃣',
    '!': '❗', '?': '❓',
};