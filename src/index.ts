import Discord, { Collection, Events, IntentsBitField, MessageFlags, TextChannel, VoiceBasedChannel } from 'discord.js'
import { Client, Guild, GuildMember, Message, VoiceChannel, VoiceState, GatewayIntentBits } from "discord.js";
import { CommandOptions, Commands, CreateEmbed, GetRole, GetTextChannel, GetUser, GetVoiceChannel, Lang, LangJ, ProgressBar, ReactionForm, Server, ServerManager, TextInput } from "./types";
import schedule from "node-schedule"
const emojiDic = require("emoji-dictionary")
import path from 'path';
import dotenv from 'dotenv'
import fs from 'fs'
import serverManager, { logVoiceAction } from './server-manager'
import createEmbed from './utils/createEmbed';
import language, { languageI } from './language';
import readAllCommands from './utils/readAllCommands';
import { handleWordFootball } from './utils/wordFootball';

type Servers = {
  [index: string]: Server;
}

type UserBalance = {
  [index: string]: number;
}

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

dotenv.config({ path: path.join(__dirname + './../.env') });
global.bot = new Discord.Client({ intents: new IntentsBitField(53608447) });
global.servers = {};
global.userBalance = {};
global.commands = {}
const { bot } = global

const token = process.env.DJS_TOKEN;

global.slashCommands = new Collection();

bot.on('clientReady', () => {
  if (process.env.STATUS) {
    if (bot.user) {
      bot.user.setActivity(process.env.STATUS)
    }
  }
  const base_file = 'command-base.js'
  const commandBase = require(`./commands/${base_file}`)

  const readCommands = (dir: string) => {
    const files = fs.readdirSync(path.join(__dirname, dir));
    for (const file of files) {
      const loc = path.join(__dirname, dir, file);
      const stat = fs.lstatSync(path.join(__dirname, dir, file));
      if (stat.isDirectory()) {
        //Složka
        readCommands(path.join(dir, file));
      } else if (file != base_file) {
        //Soubor
        const option = require(path.join(__dirname, dir, file));
        commandBase.default(option.default, loc);
      }
    }
  }

  readCommands('commands');
  console.log('This bot is online!')
})
readAllCommands(__dirname)


bot.on('interactionCreate', async interaction => {
  console.log(interaction)
  if (!interaction.isChatInputCommand()) return;
  var command = global.slashCommands.get(interaction.commandName)

  if (!command) {
    const subCommand = global.slashCommands.get(interaction.options.getSubcommand())
    if (subCommand) {
      command = subCommand
    }
    else {
      console.error(`No command matching ${interaction.commandName} was found.`);
      interaction.reply("Neznamy command, idk jaks to udelal g")
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
    }
    else {
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

//TODO: add back
// bot.on('raw', packet => {
//     if (!['MESSAGE_REACTION_ADD', 'MESSAGE_REACTION_REMOVE'].includes(packet.t)) return;
//     const channel = bot.channels.cache.get(packet.d.channel_id);
//     if (!channel) { console.log('No channel found (index.tx)'); return }
//     if (!channel.isTextBased()) { return }
//     if (channel.messages.cache.has(packet.d.message_id)) return;
//     channel.messages.fetch(packet.d.message_id).then((message: Message) => {
//         const emoji = packet.d.emoji.id ? `${packet.d.emoji.name}:${packet.d.emoji.id}` : packet.d.emoji.name;
//         const reaction = message.reactions.cache.get(emoji);
//         if (!reaction) { console.log('Reaction not found (index.ts)'); return }
//         const user = bot.users.cache.get(packet.d.user_id)
//         if (!user) { console.log('User not found (index.ts)'); return }
//         if (packet.t as string === 'MESSAGE_REACTION_ADD') { bot.emit(Events.MessageReactionAdd, reaction, user); }
//         if (packet.t as string === 'MESSAGE_REACTION_REMOVE') { bot.emit(Events.MessageReactionRemove, reaction, user); }
//     });
// });


bot.on('voiceStateUpdate', async (oldMember: VoiceState, newMember: VoiceState) => {
  let newUserChannel = newMember.channelId;
  let oldUserChannel = oldMember.channelId;

  if (newUserChannel != oldUserChannel) {
    if (newUserChannel !== null) {
      // User Joins a voice channel
      serverManager(newMember.guild.id);
      newMember.guild.id
      var server: Server = global.servers[newMember.guild.id];
      if (newUserChannel == server.cekarnaChannel) {
        //Nový čekač
        server.cekarnaPings.forEach(async element => {
          var server = bot.guilds.cache.find((guild: Guild) => guild.id === newMember.guild.id);
          if (!server) { console.log('VoiceStateUpdate error'); return }
          var user = await server.members.fetch(element)
          try {
            var name = user.user.username;
          }
          catch {
            return;
          }
          if (user.voice.channelId) {
            //je ve voice channelu
            //user.user.send("ČEKÁRNA!");
            user.user.send({
              embeds: [createEmbed(
                //@ts-ignore
                null,
                "Čekárna",
                newMember.member?.nickname,
                [],
                newMember.member?.user.avatarURL()
              )]
            })
          }
        });
      }
    }
    else if (newUserChannel === null) {
      // User leaves a voice channel
    }
  }
})

bot.on('voiceStateUpdate', async (oldState: VoiceState, newState: VoiceState) => {
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
      if (!channel) {
        channel = await bot.channels.fetch(channelId) ?? undefined;
      }
      return channel?.isTextBased() ? (channel as TextChannel) : null;
    };

    if (process.env.LOGGING_CHANNEL) {
      const channel = await getLogChannel(process.env.LOGGING_CHANNEL);
      if (channel) {
        await channel.send(`${userName} has ${action} ${targetChannel?.name || "an unknown channel"}`);
      } else {
        console.warn("LOGGING_CHANNEL is missing access or is not a text channel.");
      }
    } else {
      console.warn("Missing ENV: LOGGING_CHANNEL");
    }

    if (process.env.LOGGING_CHANNEL_RAW) {
      const rawChannel = await getLogChannel(process.env.LOGGING_CHANNEL_RAW);
      if (rawChannel) {
        const logMessage = `${newState.guild.id},${channelIdStr},${member.id},${rawActionStr}`;
        await rawChannel.send(logMessage);
      } else {
        console.warn("LOGGING_CHANNEL_RAW is missing access or is not a text channel.");
      }
    }

  } catch (error) {
    console.error("Error in voiceStateUpdate logging:", error);
  }
});
process.on("unhandledRejection", (e) => { console.log(e, "unhandled promise rejection") })
bot.on("messageReactionRemove", async (reaction, user) => {
  if (user.bot) { return }
  if (user.partial) { user = await user.fetch() }
  if (!reaction.message.guild) { return; }
  serverManager(reaction.message.guild.id)
  var server = global.servers[reaction.message.guild.id]
  if (!server.roleGiver) { return }
  if (server.roleGiver.messageID !== reaction.message.id) { return }
  const member = reaction.message.guild.members.cache.get(user.id)
  //@ts-ignore
  if (!member) { console.log('reaction no member (index.ts)'); user.send(language(reaction.message.guild.id, 'UNKWN_ERR_HALT')); return }
  var emojiString: string = emojiDic.getName(reaction.emoji.toString())

  var roleIndex = server.roleGiver.roleReactions.findIndex((value) => {
    return value.emoji === emojiString
  })

  if (reaction.count === 0) {
    reaction.message.react(reaction.emoji)
  }

  if (roleIndex != -1) {
    member.roles.remove(server.roleGiver.roleReactions[roleIndex].roleID)
  }
})

//Rule reaction
bot.on("messageReactionAdd", async (reaction, user) => {
  if (user.bot) { return }
  if (user.partial) { user = await user.fetch() }
  if (!reaction.message.guild) { return; }
  serverManager(reaction.message.guild.id)
  var server = global.servers[reaction.message.guild.id]
  if (!server.roleGiver) { return }
  if (server.roleGiver.messageID !== reaction.message.id) { return }
  const member = reaction.message.guild.members.cache.get(user.id)
  //@ts-ignore
  if (!member) { console.log('reaction no member (index.ts)'); user.send(language(reaction.message.guild.id, 'UNKWN_ERR_HALT')); return }
  var emojiString: string = emojiDic.getName(reaction.emoji.toString())

  var roleIndex = server.roleGiver.roleReactions.findIndex((value) => {
    return value.emoji === emojiString
  })

  if (reaction.count === 1) {
    reaction.message.react(reaction.emoji)
  }

  if (roleIndex != -1) {
    member.roles.add(server.roleGiver.roleReactions[roleIndex].roleID)
  }
  else {
    user.send("no, bad emoji")
    reaction.remove()
  }

})

bot.on('messageCreate', async (message: Message) => {
  await handleWordFootball(message);
});
//@ts-ignore
global.bot.setMaxListeners(0)

bot.login(token);