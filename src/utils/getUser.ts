module.exports = async (message: Message,input: string) => {
    if (input[0] === '<') {
        input = input.substring(3, input.length - 1)
    }
    if (isNaN(parseInt(input))) {
        return null
    }
    var user: Member = await message.guild.members.fetch({user: input, cache: false}).catch(() => {message.channel.send(global.lang(message.guild.id, 'UNKWN_ERR'));return null;});
    if (!user) {
        return null;
    }
    return user
}