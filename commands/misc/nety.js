module.exports = {
    commands: ['nety', 'ne_ty'],
    expectedArgs: '',
    minArgs: 0,
    maxArgs: 1,
    permissions: [],
    requiredRoles: [],
    allowedIDs: [],
    callback: (message, args, text) => {
        var server = servers[message.guild.id];
        if (!args[0])
        {
            message.channel.send("NE TY!")
        }
        else 
        {
            message.channel.send(args[0]+", ne ty!")
        }
        message.delete();
    }
}