import { Message, SlashCommandBuilder, TextChannel } from "discord.js";
import { CommandOptions } from "../../types";
import language from "../../language";
import serverManager from "../../server-manager";

export default {
    commands: ['volume', 'vol', 'v'],
    expectedArgs: '<pocet procent>',
    minArgs: 0,
    maxArgs: 1,
    permissions: [],
    requiredRoles: [],
    allowedIDs: [],
    data: new SlashCommandBuilder().addIntegerOption(option => {
        return option.setMinValue(0).setMaxValue(100).setRequired(false)
            .setName("volume").setNameLocalizations({ "cs": "hlasitost" })
            .setDescription("New volume in percents").setDescriptionLocalizations({ "cs": "Nová hlasitost v procentech" })
    }),
    isCommand: true,
    execute: async (interaction) => {
        interaction.editReply("Deprecated lol");
    },
    callback: async (message: Message, args: string[], text: string) => {
        (message.channel as TextChannel).send("Deprecated lol");
        // if (!message.guild) { return }
        // var server = global.servers[message.guild.id];
        // if (!args[0]) {
        //     (message.channel as TextChannel).send(language(message, 'CURR_VOL') + ': ' + server.volume + '%')
        // }
        // else {
        //     if (isNaN(parseFloat(args[0]))) {
        //         message.reply(language(message, 'VOL_NOT_NUM'));
        //         return;
        //     }
        //     server.volume = parseFloat(args[0])

        //     if (server.audioResource?.volume) {
        //         server.audioResource.volume.setVolume(server.volume / 100);
        //     }
        //     else {
        //         console.log("No audio Resource")
        //     }
        //     (message.channel as TextChannel).send(language(message, 'SET_VOL') + ': ' + server.volume + '%');
        //     serverManager(message.guild.id, true);
        // }
    }
} as CommandOptions