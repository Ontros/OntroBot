import { Collection, Message, SlashCommandBuilder } from "discord.js";
import fs from 'fs'
import { CommandOptions } from "../../types";

module.exports = {
    commands: ['test'],
    expectedArgs: '',
    minArgs: 0,
    maxArgs: 10,
    permissions: [],
    requiredRoles: [],
    isCommand: true,
    data: new SlashCommandBuilder(),
    callback: async (message: Message, Arguments: string[], text: string) => {
        if (!message.guild) { return }
        var server = global.servers[message.guild.id];
        message.reply("toast")
        // let startFrom = Arguments[0]
        // let globalMessages: (Collection<string, Message<true>> | Collection<string, Message<false>>)[] = []
        // while (true) {
        //     let messages = await message.channel.messages.fetch({ limit: 100, after: startFrom })

        //     globalMessages.push(messages)
        //     // globalMessages = [...globalMessages, ...messages]

        //     console.log(messages.size, startFrom)
        //     if (messages.size !== 100) { break }
        //     let last = messages.first()
        //     if (!last) {
        //         console.log(messages, "NO LAST KEY IN THE ONE BEFORE")
        //         return
        //     }

        //     startFrom = last.id



        // }
        // let extractedMessages: (Message<true> | Message<false>)[] = [];
        // for (let globalMessage of globalMessages) {
        //     globalMessage.forEach((globalos) => { extractedMessages.push(globalos) })
        // }
        // extractedMessages = extractedMessages.sort((a, b) => {
        //     if (a.createdTimestamp > b.createdTimestamp) {
        //         return 1
        //     }
        //     else if (a.createdTimestamp < b.createdTimestamp) {
        //         return -1
        //     }
        //     else {
        //         return 0
        //     }
        // })
        // let data = ""
        // for (let extractedMessage of extractedMessages) {
        //     data += (`${extractedMessage.createdTimestamp};${extractedMessage.content}`) + "\n"
        // }
        // fs.writeFile("out.txt", data, () => { })
    },
    allowedIDs: ['255345748441432064', '275639448299896833', '468845827352166430', '630088178774179871', '275626532507090944']
} as CommandOptions