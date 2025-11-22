import { Message, TextChannel } from "discord.js"
import language from "../language"
import createEmbed from "./createEmbed"

const textInput = async (userMessage: Message, botMessage: (Message), title: string, question: string, filter: (input: string) => Promise<boolean>): Promise<{ text: string, botMessage: Message<boolean>, inputMessage: Message<boolean> }> => {
    return new Promise(async (resolve, reject) => {
        //create embed:
        const embed = createEmbed(userMessage, title, question, [])

        //send/edit embed:
        if (!botMessage) {
            botMessage = await (userMessage.channel as TextChannel).send({ embeds: [embed] })
            if (!botMessage) { console.error('message sending'); reject(undefined); return }
        }
        else {
            botMessage.edit({ embeds: [embed] })
        }

        //await message:
        // const collectorFilter: CollectorFilter = (message: Message, user: User) => {
        //     return message.author.id === userMessage.author.id
        // }
        // const collection = await userMessage.channel.awaitMessages(collectorFilter, { max: 1 })
        // const inputMessage = collection.first()
        const inputMessage = (userMessage.channel as TextChannel).lastMessage
        if (!inputMessage) { console.log("mess error"); reject(undefined); return }
        if (filter) {
            if (!filter(inputMessage.content)) {
                resolve(await textInput(userMessage, botMessage, question + '\n' + language(userMessage, 'INPUT_ERR'), question, filter))
                return
            }
        }
        resolve({ text: inputMessage.content, botMessage, inputMessage })
        return
    })
}

export default textInput