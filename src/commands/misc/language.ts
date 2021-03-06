
//const Discord = require('discord.js');
module.exports = {
    commands: ['language', 'lang'],
    expectedArgs: '<lang>',
    minArgs: 0,
    maxArgs: 2,
    permissions: ["ADMINISTRATOR"],
    requiredRoles: [],
    allowedIDs: [],
    callback: (message: Message, args: string[], text: string) => {
        const {langJ, lang, Discord} = global

        if (args[0]) 
        {
            if (args[0].toLowerCase() != "list")
            {
                if (langJ.languages.includes(args[0])) {
                //if ($.inArray(args[0], langJ.languages)) {
                    global.servers[message.guild.id].language = args[0];
                    message.channel.send(lang(message.guild.id, 'LANG_SET')+': '+args[0]);
                }
                else {
                    message.reply(lang(message.guild.id, 'LANG_UNKWN'))
                    console.log("USER TRYED TO SET LANGUAGE AS: "+args[0])
                }
            }
            else {
                const Embed = new Discord.MessageEmbed()
	                .setColor('#0099ff')
	                .setTitle('Language list')
                    .setThumbnail(bot.user.avatarURL());
                var langList = "";
                langJ.languages.forEach((langua: String) => {
                    langList+=langua[0].toUpperCase()+langua.slice(1)+"\n";
                });
                Embed.addField(lang(message.guild.id, 'AVAILABLE_LANG')+":", langList);   
                Embed.setImage(bot.user.avatarURL())
	                .setTimestamp()
	                .setFooter(lang(message.guild.id, 'LANG_LIST_REQ_BY')+': '+message.author.username, message.author.avatarURL());
                message.channel.send(Embed);
            }
        }
        else 
        {
            message.channel.send(lang(message.guild.id, 'CURR_LANG_IS')+': '+global.servers[message.guild.id].language)
        }
    }
}