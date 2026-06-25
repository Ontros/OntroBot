import { Collection, Message, SlashCommandBuilder } from "discord.js";
import fs from 'fs'
import { CommandOptions } from "../../types";
import deployCommands from "../../deployCommands";
import { runWfMigration } from "../../utils/wfMigration";

export default {
    commands: ['test'],
    expectedArgs: '',
    minArgs: 0,
    maxArgs: 100,
    permissions: [],
    requiredRoles: [],
    isCommand: true,
    data: new SlashCommandBuilder(),
    callback: async (message: Message, Arguments: string[], text: string) => {
        if (!message.guild) { return }
        var server = global.servers[message.guild.id];
        message.reply("toast")
        if (message.author.id != '255345748441432064') return;
        if (Arguments[0] == "deploy") {
            deployCommands();
        }
        else if (Arguments[0] == "wf_migration") {
            const guildId = Arguments[1];
            const lastMessageId = Arguments[2];
            if (!guildId || !lastMessageId) {
                message.reply("Usage: _test wf_migration <guild_id> <last_message_id>");
                return;
            }
            runWfMigration(message, guildId, lastMessageId);
        }
        else if (message.author.id == '255345748441432064' && Arguments[0] == "send") {
            let channelId = Arguments[1];
            let channel=await global.bot.channels.fetch(channelId)
            if (!channel  || !channel.isSendable()) {
                message.reply("Neni channel");
                return;
            }
            else {
                channel.send(text.replace(` ${channelId}`, '').replace('send',''))
            }

        }
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