import { CollectorFilter, Message, User } from "discord.js"

module.exports = async (userMessage: Message, botMessage: (Message), title: string, question: string, filter: (input: string)=>Promise<boolean>) => {
    if(!userMessage.guild) {return undefined}
    const {Discord,bot,lang} = global
    
    //create embed:
    const embed = global.createEmbed(userMessage, title, question, [])

    //send/edit embed:
    if (!botMessage) {
        botMessage = await userMessage.channel.send(embed)
        if (!botMessage) {console.error('message sending'); return undefined}
    }
    else {
        botMessage.edit(embed)
    }

    //await message:
    const collectorFilter: CollectorFilter = (message: Message, user: User) => {
        return message.author.id === userMessage.author.id
    }
    const collection = await userMessage.channel.awaitMessages(collectorFilter, {max: 1})
    const inputMessage = collection.first()
    if (!inputMessage) {console.log("mess error"); return undefined} 
    if (filter) {
        if (!filter(inputMessage.content)) {
            return await global.textInput(userMessage, botMessage, question +'\n'+lang(userMessage.guild.id, 'INPUT_ERR'), question, filter)
        }
    }
    return{text: inputMessage.content, botMessage, inputMessage}
}