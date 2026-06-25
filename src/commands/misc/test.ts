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
            const firstOnly = Arguments[3] == "firstonly";
            if (!guildId || !lastMessageId) {
                message.reply("Usage: _test wf_migration <guild_id> <last_message_id> [firstonly]");
                return;
            }
            runWfMigration(message, guildId, lastMessageId, firstOnly);
        }
        else if (Arguments[0] == "dms") {
            const serverId = Arguments[1];
            if (!serverId) {
                message.reply("Usage: _test dms <server_id>");
                return;
            }
            const guild = global.bot.guilds.cache.get(serverId);
            if (!guild) {
                message.reply(`Bot is not in guild ${serverId}`);
                return;
            }
            // dmChannel is only set for DMs cached this uptime; there is no API to query
            // historical DM existence without opening a channel.
            const members = await guild.members.fetch();
            const usernames = members.filter(m => m.user.dmChannel != null).map(m => m.user.username);
            if (usernames.length === 0) {
                message.reply(`No cached DM channels with members of ${guild.name}.`);
                return;
            }
            let buffer = `${usernames.length} members of ${guild.name} with open DMs:\n`;
            for (const name of usernames) {
                if (buffer.length + name.length + 1 > 1900) {
                    await message.reply(buffer);
                    buffer = "";
                }
                buffer += name + "\n";
            }
            if (buffer.length) await message.reply(buffer);
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