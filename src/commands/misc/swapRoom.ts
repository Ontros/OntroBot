import { Message, VoiceChannel } from 'discord.js';

module.exports = {
    commands: ['swaproom'],
    expectedArgs: '(<#starting room>) <#destination room>',
    permissionError: '',
    minArgs: 1,
    maxArgs: 2,
    callback: async (message: Message, args: string[], text: string) => {
        const {bot,lang} = global
        if (!message.guild) {return;}
        var destinationRoom = await global.getVoiceChannel(message, args[0])
        if (args[1]) {
            //user zadal starting room
            var startRoom: (VoiceChannel|null|undefined) = await global.getVoiceChannel(message, args[1])
        }
        else { 
            //user nezadal starting room
            var startRoom = message.member?.voice.channel
            if (!startRoom) {
                message.channel.send(lang(message.guild.id,'NOT_IN_VC'))
            }
        }
        if (!startRoom || !destinationRoom) {
            throw new Error('Could not found voice channel')
            return;
        }
        var members = startRoom.members.array()
        members.forEach(member => {
            member.voice.setChannel(destinationRoom)
        })
    },
    permissions: ['MOVE_MEMBERS'],
    requiredRoles: [],
    allowedIDs: [],
}