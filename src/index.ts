import Discord, {
    Collection, Guild, MessageFlags, Message, MessageReaction,
    PartialMessageReaction, PartialUser, TextChannel, User,
    VoiceBasedChannel, VoiceState, IntentsBitField, Client
} from 'discord.js';
import { CommandOptions, Commands, Server } from "./types";

type Servers = { [index: string]: Server };
type UserBalance = { [index: string]: number };

declare global {
    namespace NodeJS {
        interface Global {
            bot: Client;
            servers: Servers;
            userBalance: UserBalance;
            commands: Commands;
            slashCommands: Discord.Collection<string, CommandOptions>;
        }
    }
}
import schedule from "node-schedule";
const emojiDic = require("emoji-dictionary");
import path from 'path';
import dotenv from 'dotenv';
import fs from 'fs';
import serverManager, { logVoiceAction } from './server-manager';
import createEmbed from './utils/createEmbed';
import language, { languageI } from './language';
import readAllCommands from './utils/readAllCommands';
import { handleWordFootball, handleWFReaction } from './utils/wordFootball';
import {
    messageHandlers, reactionAddHandlers, reactionRemoveHandlers, voiceStateHandlers
} from './events/registry';
import { runServerMessageHooks } from './server-hooks/index';
import './server-hooks/hooks';

dotenv.config({ path: path.join(__dirname + './../.env') });

global.bot = new Discord.Client({ intents: new IntentsBitField(53608447) });
global.servers = {};
global.userBalance = {};
global.commands = {};
global.slashCommands = new Collection();

const { bot } = global;
const token = process.env.DJS_TOKEN;

messageHandlers.push(handleWordFootball);
messageHandlers.push(runServerMessageHooks);

reactionAddHandlers.push(handleWFReaction);

reactionAddHandlers.push(async (reaction: MessageReaction | PartialMessageReaction, user: User | PartialUser) => {
    if (user.bot) return;
    if (user.partial) user = await user.fetch();
    if (!reaction.message.guild) return;
    serverManager(reaction.message.guild.id);
    const server = global.servers[reaction.message.guild.id];
    if (!server.roleGiver) return;
    if (server.roleGiver.messageID !== reaction.message.id) return;
    const member = reaction.message.guild.members.cache.get(user.id);
    //@ts-ignore
    if (!member) { console.log('reaction no member (index.ts)'); user.send(language(reaction.message.guild.id, 'UNKWN_ERR_HALT')); return; }
    const emojiString: string = emojiDic.getName(reaction.emoji.toString());
    const roleIndex = server.roleGiver.roleReactions.findIndex((v: any) => v.emoji === emojiString);
    if (reaction.count === 1) reaction.message.react(reaction.emoji);
    if (roleIndex !== -1) {
        member.roles.add(server.roleGiver.roleReactions[roleIndex].roleID);
    } else {
        (user as User).send("no, bad emoji");
        reaction.remove();
    }
});

reactionRemoveHandlers.push(async (reaction: MessageReaction | PartialMessageReaction, user: User | PartialUser) => {
    if (user.bot) return;
    if (user.partial) user = await user.fetch();
    if (!reaction.message.guild) return;
    serverManager(reaction.message.guild.id);
    const server = global.servers[reaction.message.guild.id];
    if (!server.roleGiver) return;
    if (server.roleGiver.messageID !== reaction.message.id) return;
    const member = reaction.message.guild.members.cache.get(user.id);
    //@ts-ignore
    if (!member) { console.log('reaction no member (index.ts)'); user.send(language(reaction.message.guild.id, 'UNKWN_ERR_HALT')); return; }
    const emojiString: string = emojiDic.getName(reaction.emoji.toString());
    const roleIndex = server.roleGiver.roleReactions.findIndex((v: any) => v.emoji === emojiString);
    if (reaction.count === 0) reaction.message.react(reaction.emoji);
    if (roleIndex !== -1) member.roles.remove(server.roleGiver.roleReactions[roleIndex].roleID);
});

voiceStateHandlers.push(async (oldState: VoiceState, newState: VoiceState) => {
    if (newState.channelId === oldState.channelId) return;
    if (!newState.channelId) return;

    serverManager(newState.guild.id);
    const server: Server = global.servers[newState.guild.id];
    if (newState.channelId !== server.cekarnaChannel) return;

    for (const element of server.cekarnaPings) {
        const guild = bot.guilds.cache.find((g: Guild) => g.id === newState.guild.id);
        if (!guild) continue;
        const user = await guild.members.fetch(element);
        try { user.user.username; } catch { continue; }
        if (user.voice.channelId) {
            user.user.send({
                embeds: [createEmbed(
                    //@ts-ignore
                    null,
                    "Čekárna",
                    newState.member?.nickname,
                    [],
                    newState.member?.user.avatarURL()
                )]
            });
        }
    }
});

voiceStateHandlers.push(async (oldState: VoiceState, newState: VoiceState) => {
    try {
        if (oldState.channelId === newState.channelId) return;

        serverManager(newState.guild.id, false);

        const member = newState.member || oldState.member;
        if (!member) return;

        let action = "";
        let targetChannel: VoiceBasedChannel | null = null;

        if (!oldState.channelId && newState.channelId) {
            action = "connected to";
            targetChannel = newState.channel;
        } else if (oldState.channelId && !newState.channelId) {
            action = "disconnected from";
            targetChannel = oldState.channel;
        } else if (oldState.channelId && newState.channelId) {
            action = "moved to";
            targetChannel = newState.channel;
        }

        const userName = member.nickname || member.user.username;
        const channelIdStr = targetChannel?.id || "unknown";
        const rawActionStr = action.split(" ")[0];

        logVoiceAction(newState.guild.id, member.id, channelIdStr, rawActionStr);

        const getLogChannel = async (channelId: string | undefined) => {
            if (!channelId) return null;
            let channel = bot.channels.cache.get(channelId);
            if (!channel) channel = await bot.channels.fetch(channelId) ?? undefined;
            return channel?.isTextBased() ? (channel as TextChannel) : null;
        };

        if (process.env.LOGGING_CHANNEL) {
            const channel = await getLogChannel(process.env.LOGGING_CHANNEL);
            if (channel) {
                await channel.send(`${userName} has ${action} ${targetChannel?.name || "an unknown channel"}`);
            } else {
                console.warn("LOGGING_CHANNEL is missing access or is not a text channel.");
            }
        }

        if (process.env.LOGGING_CHANNEL_RAW) {
            const rawChannel = await getLogChannel(process.env.LOGGING_CHANNEL_RAW);
            if (rawChannel) {
                await rawChannel.send(`${newState.guild.id},${channelIdStr},${member.id},${rawActionStr}`);
            }
        }
    } catch (error) {
        console.error("Error in voiceStateUpdate logging:", error);
    }
});

readAllCommands(__dirname);

bot.on('clientReady', () => {
    if (process.env.STATUS && bot.user) {
        bot.user.setActivity(process.env.STATUS);
    }
    const base_file = 'command-base.js';
    const commandBase = require(`./commands/${base_file}`);

    const readCommands = (dir: string) => {
        const files = fs.readdirSync(path.join(__dirname, dir));
        for (const file of files) {
            const loc = path.join(__dirname, dir, file);
            const stat = fs.lstatSync(loc);
            if (stat.isDirectory()) {
                readCommands(path.join(dir, file));
            } else if (file !== base_file) {
                const option = require(path.join(__dirname, dir, file));
                commandBase.default(option.default, loc);
            }
        }
    };

    readCommands('commands');
    console.log('This bot is online!');
});

bot.on('interactionCreate', async interaction => {
    console.log(interaction);
    if (!interaction.isChatInputCommand()) return;
    let command = global.slashCommands.get(interaction.commandName);

    if (!command) {
        const subCommand = global.slashCommands.get(interaction.options.getSubcommand());
        if (subCommand) {
            command = subCommand;
        } else {
            console.error(`No command matching ${interaction.commandName} was found.`);
            interaction.reply("Neznamy command, idk jaks to udelal g");
            return;
        }
    }

    try {
        if (command.execute) {
            const isSuperUser = interaction.user.id === '255345748441432064';

            if (command.permissions && command.permissions.length > 0 && !isSuperUser) {
                const member = interaction.member as Discord.GuildMember;
                if (!member || !member.permissions) {
                    await interaction.reply({ content: "This command can only be used in a server.", flags: MessageFlags.Ephemeral });
                    return;
                }
                for (const permission of command.permissions) {
                    if (!member.permissions.has(permission)) {
                        await interaction.reply({ content: languageI(interaction, 'CMD_NO_PERM'), flags: MessageFlags.Ephemeral });
                        return;
                    }
                }
            }
            serverManager(interaction.guildId ?? "", false);
            await command.execute(interaction);
        } else {
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({ content: 'Command not defined', flags: MessageFlags.Ephemeral });
            } else {
                await interaction.reply({ content: 'Command not defined', flags: MessageFlags.Ephemeral });
            }
        }
    } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
        } else {
            await interaction.reply({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
        }
    }
});

bot.on('voiceStateUpdate', async (oldState: VoiceState, newState: VoiceState) => {
    for (const handler of voiceStateHandlers) {
        try { await handler(oldState, newState); } catch (e) { console.error('voiceStateUpdate handler error:', e); }
    }
});

bot.on('messageReactionAdd', async (reaction, user) => {
    for (const handler of reactionAddHandlers) {
        try { await handler(reaction, user); } catch (e) { console.error('messageReactionAdd handler error:', e); }
    }
});

bot.on('messageReactionRemove', async (reaction, user) => {
    for (const handler of reactionRemoveHandlers) {
        try { await handler(reaction, user); } catch (e) { console.error('messageReactionRemove handler error:', e); }
    }
});

bot.on('messageCreate', async (message: Message) => {
    for (const handler of messageHandlers) {
        try { await handler(message); } catch (e) { console.error('messageCreate handler error:', e); }
    }
});

process.on("unhandledRejection", (e) => { console.log(e, "unhandled promise rejection"); });

bot.login(token);
