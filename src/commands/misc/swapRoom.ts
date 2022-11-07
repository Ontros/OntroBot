import { Message, VoiceBasedChannel, VoiceChannel } from 'discord.js';

module.exports = {
    commands: ['swaproom'],
    expectedArgs: '(<#starting room>) <#destination room> (...<@ignoredUsers>)',
    permissionError: '',
    minArgs: 1,
    maxArgs: 3,
    callback: async (message: Message, args: string[], text: string) => {
        const { bot, lang } = global
        if (!message.guild) { return; }
        var destinationRoom: (VoiceChannel | null) = await global.getVoiceChannel(message, args[0])
        var mentionAmount = 0
        if (message.mentions.users) {
            mentionAmount = message.mentions.users.map(val => { return val }).length
        }
        if (args.length - mentionAmount === 2) {
            //user zadal starting room
            var startRoom: (VoiceBasedChannel | null | undefined) = await global.getVoiceChannel(message, args[0])
            destinationRoom = await global.getVoiceChannel(message, args[1])
        }
        else {
            //user nezadal starting room
            var startRoom = message.member?.voice.channel
            destinationRoom = await global.getVoiceChannel(message, args[0])
            if (!startRoom) {
                message.channel.send(lang(message.guild.id, 'NOT_IN_VC'))
            }
        }
        if (!startRoom || !destinationRoom) {
            message.channel.send(lang(message.guild.id, 'INPUT_ERR_HALT'))
            //throw new Error('Could not found voice channel')
            return;
        }
        // var members = startRoom.members.array()
        var members = startRoom.members.map((val) => { return val })
        members.forEach(member => {
            if (!message.mentions.has(member.user)) {
                member.voice.setChannel(destinationRoom)
            }
        })
    },
    permissions: ['MOVE_MEMBERS'],
    requiredRoles: [],
    allowedIDs: [],
}