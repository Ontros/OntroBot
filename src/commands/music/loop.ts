import { Message, SlashCommandBuilder } from "discord.js";
import { CommandOptions } from "../../types";
import language from "../../language";
import serverManager from "../../server-manager";
import createEmbed from "../../utils/createEmbed";

export default {
    commands: ['loop', 'l'],
    maxArgs: 1,
    minArgs: 0,
    requireChannelPerms: false,
    expectedArgs: "",
    isCommand: true,
    data: new SlashCommandBuilder().addStringOption(option => {
        return option.setRequired(false).setChoices({ name: "stop", value: "0" },
            { name: "queue", value: "1" },
            { name: "random", value: "2" },
            { name: "track", value: "3" },
        ).setName("loop-type").setDescription("Type of loop")
    }),
    callback: async (message: Message, args: string[], text: string) => {
        if (!message.guild) { return }
        var server = global.servers[message.guild.id];
        if (!args[0]) {
            //loop help
            message.channel.send({
                embeds: [createEmbed(message, 'Loop help', `Current loop state is: ${server.loop}\nUse '_loop <new state>' to change`,
                    [{ name: 'stop(0)', value: 'Stops looping', inline: false },
                    { name: 'queue(1)', value: 'Starts queuing', inline: false },
                    { name: 'random(2)', value: 'Starts random queue', inline: false },
                    { name: 'track(3)', value: 'Starts looping current track', inline: false }])]
            })
            return
        }
        if (['0', 'stop'].some(i => i === args[0])) {
            //no queue
            message.channel.send(language(message, 'LOOP_NO'));
            server.loop = 0;
        }
        else if (['1', 'queue'].some(i => i === args[0])) {
            //loop queue
            message.channel.send(language(message, 'LOOP_QUEUE'));
            server.loop = 1;
        }
        else if (['2', 'random'].some(i => i === args[0])) {
            //loop random queue
            message.channel.send(language(message, 'LOOP_QUEUE_RANDOM'));
            server.loop = 2;
        }
        else if (['3', 'track'].some(i => i === args[0])) {
            //loop song
            message.channel.send(language(message, 'LOOP_TRACK'));
            server.loop = 3;
        }
        else {
            message.channel.send(language(message, 'INPUT_ERR_HALT'))
        }
        serverManager(message.guild.id, true);
    },
    permissions: [],
    requiredRoles: [],
    allowedIDs: [],
} as CommandOptions