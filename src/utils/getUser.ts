module.exports = async (message: Message,input: string) => {
    if (input[0] === '<') {
        input = input.substring(3, input.length - 1)
    }
    if (isNaN(parseInt(input))) {
        message.channel.send(global.lang(message.guild.id, 'USR_ID_NOT'))
        return null
    }
    var user: Member = await message.guild.members.fetch({user: input, cache: false}).catch(() => {message.channel.send(global.lang(message.guild.id, 'UNKWN_ERR'));return null});
    if (!user) {
        var mes = await message.channel.send('<@!'+input+'>')
        mes.delete()
        if (!user) {
            var user: Member = await message.guild.members.fetch({user: input, cache: false}).catch(() => {message.channel.send(global.lang(message.guild.id, 'UNKWN_ERR'));return null});
            message.channel.send(global.lang(message.guild.id, 'USR_ID_NOT'));
            return null
        }
    }
    return user
}