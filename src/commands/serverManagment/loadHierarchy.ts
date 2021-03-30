module.exports = {
    commands: ['loadHierarchy'],
    expectedArgs: '<id|mention>',
    permissionError: '',
    minArgs: 2,
    maxArgs: 99,
    callback: (message: Message, args: string[], text: string) => {
        args.forEach(id=>{
            if (!message.guild.roles.cache.get(id)) {
                //Not directly ID
                id = id.substring(3,args[0].length-1)
                if (!message.guild.roles.cache.get(id)) {
                    message.reply(global.lang(message.guild.id, 'ROLE_ID_NOT'));
                    return
                }
            }
            const Role = message.guild.roles.cache.get(id)
            var step:Step = {
                id,
                name: Role.name,
                emoji: Role.name.split(' ')[0]
            }
            global.servers[message.guild.id].steps.push(step)
        })
        serverManager(message.guild.id, true);
    },
    permissions: ["ADMINISTRATOR"],
    requiredRoles: [],
    allowedIDs: [],
} 