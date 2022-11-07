import { EmbedField, Message } from "discord.js"
import { ButtonOption, ButtonOutput } from "../types"

module.exports = async (userMessage: Message, botMessage: (Message), title: string, question: string, buttonOption: ButtonOption[]) => {
    if (!userMessage.guild) { return }
    return "Discontinued"
    // const { Discord, bot, lang } = global
    // if (!bot.user) { return }
    // const avatarURL = bot.user.avatarURL()
    // if (!avatarURL) { userMessage.channel.send(lang(userMessage.guild.id, 'ERR_AVATAR')); return }
    // //botMessage.reactions.removeAll()

    // //generate embed:
    // const field: EmbedField[] = [];
    // //field[0] = {name: question, value: '', inline: false};
    // const embed = global.createEmbed(userMessage, title, question, field)

    // //create buttons:
    // var buttons: MessageButton[] = [];
    // var id = 0
    // buttonOption.forEach((option) => {
    //     buttons.push(new MessageButton().setLabel(option.title).setStyle('green').setID(id.toString()))
    //     id++;
    // })
    // if (botMessage) { await botMessage.delete() }

    // //send message:
    // //Expect because this was written before discord.js button typescipt support lol
    // //@ts-ignore
    // botMessage = await userMessage.channel.send('', { embed: embed, buttons: buttons })
    // async function callback(button: any) {
    //     if (button.clicker.user.id !== userMessage.id) { return }
    //     global.bot.removeListener('clickButton', callback)
    //     var id = parseInt(button.id, 10)
    //     if (isNaN(id)) { console.log('idNaN in buttonForm'); return }
    //     // console.log(id)
    //     const output: ButtonOutput = {
    //         id,
    //         userMessage,
    //         botMessage,
    //     }
    //     return output
    // }

    // return new Promise<ButtonOutput>(resolve => {
    //     global.bot.on('clickButton',
    //         async (button: any) => {
    //             if (button.clicker.user.id !== userMessage.author.id) { console.log('cizinec'); return }
    //             // console.log('uwu')
    //             global.bot.removeListener('clickButton', callback)
    //             var id = parseInt(button.id, 10)
    //             if (isNaN(id)) { console.log('idNaN in buttonForm'); return }
    //             // console.log(id)
    //             const output: ButtonOutput = {
    //                 id,
    //                 userMessage,
    //                 botMessage,
    //             }
    //             resolve(output)
    //             return output
    //         }
    //     )
    // })


}