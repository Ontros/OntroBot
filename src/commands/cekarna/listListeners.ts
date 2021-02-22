//const serverManager = require('../.././server-manager');
module.exports = {
    commands: ['listListeners'],
    expectedArgs: '',
    minArgs: 0,
    maxArgs: 0,
    permissions: [],
    requiredRoles: [],
    allowedIDs: [],
    callback: (message: Message, args: string[], text: string) => {
        global.servers[message.guild.id].cekarnaPings.forEach(element => {
            var user = bot.users.cache.find(user => user.id === element)
            try {
                message.channel.send(user.username);
            }
            catch {
                message.channel.send(element)
                return;
            }
        })
    }
}