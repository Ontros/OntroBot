//const Discord = require('discord.js');

module.exports = {
    commands: ['queue'],
    permissions: [],
    requireChannelPerms: true,
    requiredRoles: [],
    allowedIDs: [],
    callback: (message: Message, args: string[], text: string, bot: Bot) => {
        var server = global.servers[message.guild.id];
        const {lang, Discord} = global;
        //if (!server.queue) 
        //{
        //    message.channel.send('Nic nehraje debílku! :angry:');
        //}
        var i = 1;
        const exampleEmbed = new Discord.MessageEmbed()
	        .setColor('#0099ff')
	        .setTitle('Queue')
	        .setThumbnail(bot.user.avatarURL());
        server.queue.forEach(song => {
            exampleEmbed.addField(i + '. [' + song.title + '](' + song.url + ')', lang(message.guild.id, 'REQ_BY')+': '+song.requestedBy);
            i++;
        });
                        
        exampleEmbed.setImage(bot.user.avatarURL())
	        .setTimestamp()
	        .setFooter(lang(message.guild.id, 'QUEUE_LIST_REQ_BY')+': '+message.author.username, message.author.avatarURL());
        message.channel.send(exampleEmbed);
    },
}