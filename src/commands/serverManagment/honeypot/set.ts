import { ChannelType, Message, SlashCommandSubcommandBuilder, TextChannel } from "discord.js";
import { CommandOptions } from "../../../types";
import language, { languageI } from "../../../language";
import db from "../../../database";

const upsertHoneypot = db.prepare(`INSERT OR REPLACE INTO honeypot (guild_id, channel_id, log_channel_id, ban_dm_message) VALUES (?, ?, ?, ?)`);

export default {
    commands: ['honeypotset'],
    expectedArgs: '<honeypotChannel> <logChannel> [banDmMessage]',
    minArgs: 2,
    maxArgs: 100,
    permissions: ["ADMINISTRATOR"],
    requiredRoles: [],
    allowedIDs: [],
    data: new SlashCommandSubcommandBuilder()
        .addChannelOption(option => option
            .addChannelTypes(ChannelType.GuildText)
            .setRequired(true)
            .setName("channel")
            .setNameLocalizations({ "cs": "kanal" })
            .setDescription("Honeypot channel (anyone who types here gets banned)")
            .setDescriptionLocalizations({ "cs": "Honeypot kanál (kdokoliv sem napíše bude zabanován)" })
        )
        .addChannelOption(option => option
            .addChannelTypes(ChannelType.GuildText)
            .setRequired(true)
            .setName("log")
            .setNameLocalizations({ "cs": "log" })
            .setDescription("Channel where honeypot catches are logged")
            .setDescriptionLocalizations({ "cs": "Kanál kam se logují honeypot záznamy" })
        )
        .addStringOption(option => option
            .setRequired(false)
            .setName("dm")
            .setNameLocalizations({ "cs": "dm" })
            .setDescription("Message DMed to the user right before they are banned")
            .setDescriptionLocalizations({ "cs": "Zpráva poslaná uživateli do DM těsně před zabanováním" })
        ),
    isCommand: true,
    execute: async (interaction) => {
        if (!interaction.guildId) return;
        const channel = interaction.options.getChannel("channel", true);
        const logChannel = interaction.options.getChannel("log", true);
        const dmMessage = interaction.options.getString("dm");
        upsertHoneypot.run(interaction.guildId, channel.id, logChannel.id, dmMessage);
        await interaction.reply(languageI(interaction, 'HONEYPOT_SET') + `: <#${channel.id}> → <#${logChannel.id}>`);
    },
    callback: async (message: Message, args: string[], text: string) => {
        if (!message.guild) return;
        const honeypotId = args[0].replace(/[<#>]/g, '');
        const logId = args[1].replace(/[<#>]/g, '');
        const dmMessage = args.slice(2).join(' ') || null;
        const honeypotChannel = message.guild.channels.cache.get(honeypotId);
        const logChannel = message.guild.channels.cache.get(logId);
        if (!honeypotChannel || !honeypotChannel.isTextBased()) {
            await (message.channel as TextChannel).send(language(message, 'CHAN_ID_NOT'));
            return;
        }
        if (!logChannel || !logChannel.isTextBased()) {
            await (message.channel as TextChannel).send(language(message, 'CHAN_ID_NOT'));
            return;
        }
        upsertHoneypot.run(message.guild.id, honeypotId, logId, dmMessage);
        await (message.channel as TextChannel).send(language(message, 'HONEYPOT_SET') + `: <#${honeypotId}> → <#${logId}>`);
    }
} as CommandOptions
