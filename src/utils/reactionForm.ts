import { CollectorFilter, EmbedField, Message, MessageReaction, PartialMessageReaction, PartialUser, User } from "discord.js"
import { ReactionFormOption, ReactionFormOutput } from "../types"
import language from "../language";
import createEmbed from "./createEmbed";

export default async (userMessage: Message, botMessage: (Message | null), title: string, question: string, formOptions: ReactionFormOption[], deleteAfter?: boolean) => {

    return new Promise(async (resolve, reject) => {
        if (!global.bot.user) { reject(); return }
        const avatarURL = global.bot.user.avatarURL()
        if (!avatarURL) { userMessage.channel.send(language(userMessage, 'ERR_AVATAR')); return }
        if (question.length > 256) {
            console.error('Question too long ' + question)
            reject()
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
        const embed = createEmbed(userMessage, title, null, field)

        //send/edit embed:
        if (!botMessage) {
            botMessage = await userMessage.channel.send({ embeds: [embed] })
            if (!botMessage) { console.error('message sending'); reject(); return }
        }
        else {
            botMessage.edit({ embeds: [embed] })
        }

        //add missing reactions
        const reactionsFiltered = reactions.filter((react) => { return !(botMessage as Message<boolean>).reactions.cache.has(react) })
        addReactions(botMessage, reactionsFiltered)

        await botMessage.fetch()
        const listener = async (reactionRaw: (MessageReaction | PartialMessageReaction), user: (User | PartialUser)) => {
            try {

                const reaction = await reactionRaw.fetch()
                if (user.bot) {
                    return
                }
                if (reaction.message.id !== (botMessage as Message<boolean>).id) {
                    return
                }
                //Filter other users
                if (user.id !== userMessage.author.id) {
                    reaction.remove()
                    return
                }
                if (!reaction.emoji.name) { return }
                if (!(reactions.includes(reaction.emoji.name) && reaction.client.user.id)) {
                    return
                }
                global.bot.off('messageReactionAdd', listener)
                const callNum = emojiNumbers.indexOf(reaction.emoji.name ? reaction.emoji.name : "-1")
                const output: ReactionFormOutput = {
                    id: callNum,
                    userMessage,
                    botMessage: botMessage as Message<boolean>,
                    formOption: formOptions[callNum]
                }
                formOptions[callNum].callback?.(userMessage, botMessage as Message<boolean>, reaction)
                resolve(output)
            }
            catch (e) {
            }
        }
        global.bot.on('messageReactionAdd', listener)

    }) as Promise<ReactionFormOutput>
}

const addReactions = async (message: Message, reactions: string[]) => {
    for (var reaction of reactions) {
        message.react(reaction).catch(() => { })
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