const Discord = require('discord.js');

module.exports = {
    commands: ['queue'],
    permissions: [],
    requiredRoles: [],
    allowedIDs: [],
    callback: (message, arguments, text, bot) => {
        var server = servers[message.guild.id];
        if (!server.queue) 
        {
            message.channel.send('Nic nehraje debílku! :angry:');
        }
        else 
        {
            var i = 1;
            const exampleEmbed = new Discord.MessageEmbed()
	            .setColor('#0099ff')
	            .setTitle('Queue')
	            .setThumbnail(bot.user.avatar_url);
            server.queue.forEach(song => {
                exampleEmbed.addField(i + '. [' + song.title + '](' + song.url + ')', 'Requested by: '+song.requestedBy);
                i++;
            });
                        
            exampleEmbed.setImage(bot.user.avatar_url)
	            .setTimestamp()
	            .setFooter('Queue list requested by: '+message.author.username, message.author.avatarURL());
            message.channel.send(exampleEmbed);
        }
    },
}