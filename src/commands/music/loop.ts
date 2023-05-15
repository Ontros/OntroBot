import { Message } from "discord.js";

module.exports = {
    commands: ['loop', 'l'],
    maxArgs: 1,
    minArgs: 0,
    requireChannelPerms: false,
    callback: async (message: Message, args: string[], text: string) => {
        if (!message.guild) { return }
        var server = global.servers[message.guild.id];
        const { lang } = global
        if (!args[0]) {
            //loop help
            message.channel.send({
                embeds: [global.createEmbed(message, 'Loop help', `Current loop state is: ${server.loop}\nUse '_loop <new state>' to change`,
                    [{ name: 'stop(0)', value: 'Stops looping', inline: false },
                    { name: 'queue(1)', value: 'Starts queuing', inline: false },
                    { name: 'random(2)', value: 'Starts random queue', inline: false },
                    { name: 'track(3)', value: 'Starts looping current track', inline: false }])]
            })
            return
        }
        if (['0', 'stop'].some(i => i === args[0])) {
            //no queue
            message.channel.send(lang(message.guild.id, 'LOOP_NO'));
            server.loop = 0;
        }
        else if (['1', 'queue'].some(i => i === args[0])) {
            //loop queue
            message.channel.send(lang(message.guild.id, 'LOOP_QUEUE'));
            server.loop = 1;
        }
        else if (['2', 'random'].some(i => i === args[0])) {
            //loop random queue
            message.channel.send(lang(message.guild.id, 'LOOP_QUEUE_RANDOM'));
            server.loop = 2;
        }
        else if (['3', 'track'].some(i => i === args[0])) {
            //loop song
            message.channel.send(lang(message.guild.id, 'LOOP_TRACK'));
            server.loop = 3;
        }
        else {
            message.channel.send(lang(message.guild.id, 'INPUT_ERR_HALT'))
        }
        global.serverManager(message.guild.id, true);
    },
    permissions: [],
    requiredRoles: [],
    allowedIDs: [],
}