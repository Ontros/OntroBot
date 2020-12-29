module.exports = {
    commands: ['measurePing'],
    permissions: [],
    requiredRoles: [],
    allowedIDs: [],
    callback: (message, arguments, text, bot) => {
        message.channel.send("Pinging...").then(m =>{
            var ping = m.createdTimestamp - message.createdTimestamp;
            var botPing = Math.round(bot.pi);

            m.edit(`**:ping_pong: Pong! Your Ping Is:-**\n  ${ping}ms`);
        });
    }
}