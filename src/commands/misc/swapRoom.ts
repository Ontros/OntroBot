import { ChannelType, Message, SlashCommandBuilder, VoiceBasedChannel, VoiceChannel } from 'discord.js';
import { CommandOptions } from '../../types';
import getVoiceChannel from '../../utils/getVoiceChannel';
import language from '../../language';

export default {
    commands: ['swaproom'],
    expectedArgs: '(<#starting room>) <#destination room> (...<@ignoredUsers>)',
    permissionError: '',
    minArgs: 1,
    maxArgs: 3,
    isCommand: true,
    data: new SlashCommandBuilder().addChannelOption(option => {
        return option.addChannelTypes(ChannelType.GuildVoice, ChannelType.GuildStageVoice)
            .setName("to-room").setNameLocalizations({ cs: "finální-roomka" })
            .setDescription("To this room you will be moved").setDescriptionLocalizations({ cs: "Do této roomky budete přesunuti" })
            .setRequired(true)
    }).addChannelOption(option => {
        return option.addChannelTypes(ChannelType.GuildVoice, ChannelType.GuildStageVoice)
            .setName("from-room").setNameLocalizations({ cs: "počáteční-roomka" })
            .setDescription("From this room you will be moved").setDescriptionLocalizations({ cs: "Z této roomky budete přesunuti" })
            .setRequired(false)
    }),
    callback: async (message: Message, args: string[], text: string) => {
        const { bot } = global
        if (!message.guild) { return; }
        var destinationRoom = await getVoiceChannel(message, args[0])
        var mentionAmount = 0
        if (message.mentions.users) {
            mentionAmount = message.mentions.users.map(val => { return val }).length
        }
        if (args.length - mentionAmount === 2) {
            //user zadal starting room
            var startRoom = await getVoiceChannel(message, args[0])
            destinationRoom = await getVoiceChannel(message, args[1])
        }
        else {
            //user nezadal starting room
            var startRoom = message.member?.voice.channel
            destinationRoom = await getVoiceChannel(message, args[0])
            if (!startRoom) {
                message.channel.send(language(message, 'NOT_IN_VC'))
            }
        }
        if (!startRoom || !destinationRoom) {
            message.channel.send(language(message, 'INPUT_ERR_HALT'))
            //throw new Error('Could not found voice channel')
            return;
        }
        // var members = startRoom.members.array()
        var members = startRoom.members.map((val) => { return val })
        members.forEach(member => {
            if (!message.mentions.has(member.user)) {
                member.voice.setChannel((destinationRoom as VoiceBasedChannel))
            }
        })
    },
    permissions: ['MOVE_MEMBERS'],
    requiredRoles: [],
    allowedIDs: [],
} as CommandOptions