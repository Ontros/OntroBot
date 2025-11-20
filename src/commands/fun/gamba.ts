import { time } from "console";
import { Message, MessageFlags, SlashCommandBuilder, TextChannel } from "discord.js";
import { CommandOptions } from "../../types";

export default {
    commands: ['gamba', 'g'],
    permissions: [],
    requiredRoles: [],
    allowedIDs: [],
    expectedArgs: "<amount> <times?>",
    isCommand: true,
    minArgs: 1,
    maxArgs: 2,
    data: new SlashCommandBuilder().addIntegerOption(option => {
        return option.setRequired(true)
            .setMinValue(0)
            .setName("money").setNameLocalizations({ "cs": "peníze" })
            .setDescription("Amount to gamba (0=all)").setDescriptionLocalizations({ "cs": "Množtví na gambu" })
    }).addIntegerOption(option => {
        return option.setRequired(false)
            .setMinValue(1)
            .setName("repetetion").setNameLocalizations({ "cs": "opakovani" })
            .setDescription("How many times to do the gamba").setDescriptionLocalizations({ "cs": "Kolikrát provést gambu" })
    }),
    callback: async (message: Message, args: string[], text: string) => {
        if (!message.guild) { return }
        //Get player
        var user = message.author.id
        var amount = parseInt(args[0])
        var times = Math.round(parseInt(args[1] ? args[1] : "1"))
        try {
            if (global.userBalance[user] === undefined) {
                global.userBalance[user] = 1000000
            }
        }
        catch {
            global.userBalance[user] = 1000000
        }
        if (args[0] === "all") {
            amount = global.userBalance[user] / 2
        }
        else if (isNaN(amount)) {
            (message.channel as TextChannel).send(`You have ${global.userBalance[user]} OnCoins\n If you want to gamba do _g <amount>`)
            return
        }
        if (isNaN(times) || times < 1 || times > 1000000) {
            (message.channel as TextChannel).send("kokote")
            return
        }
        if (global.userBalance[user] < amount) {
            (message.channel as TextChannel).send(`ur broke, lmao ratiod`)
            return
        }
        var lost = 0
        var won = 0
        for (var i = times; i--; i > 0) {
            var rand = Math.random()
            if (args[0] === "all") {
                amount = global.userBalance[user] / 2
            }
            global.userBalance[user] -= amount
            if (rand < .5) {
                lost++
                global.userBalance[user] += amount * 0
                if (times === 1)
                    (message.channel as TextChannel).send(`${message.author.username} won ${amount * 0}; You now have ${global.userBalance[user]} OnCoins`)
            }
            else if (rand > .5) {
                won++
                global.userBalance[user] += amount * 3
                if (times === 1)
                    (message.channel as TextChannel).send(`${message.author.username} won ${amount * 3}; You now have ${global.userBalance[user]} OnCoins`)
            }
            else {
                (message.channel as TextChannel).send(".5")
            }
        }
        (message.channel as TextChannel).send(`${message.author.username} has ${global.userBalance[user]} OnCoins; Won ${won}x, Lost ${lost}x`)
    },
    execute: async (interaction) => {
        //Get player
        if (!interaction.guild || !interaction.channel) return;
        var user = interaction.user.id
        var amount: number = interaction.options.get('money')?.value as number
        var times: number = interaction.options.get('repetetion')?.value as number
        await interaction.reply("Zacinam gambu")
        if (!amount) {
            interaction.editReply("kokote")
            return;
        }
        if (!times) {
            times = 1
        }
        try {
            if (global.userBalance[user] === undefined) {
                global.userBalance[user] = 1000000
            }
        }
        catch {
            global.userBalance[user] = 1000000
        }
        let isAll = 0
        if (amount === 0) {
            amount = global.userBalance[user] / 2
            isAll = 1
        }
        if (global.userBalance[user] < amount) {
            interaction.editReply(`ur broke, lmao ratiod`)
            return
        }
        var lost = 0
        var won = 0
        for (var i = times; i--; i > 0) {
            var rand = Math.random()
            if (isAll) {
                amount = global.userBalance[user] / 2
            }
            global.userBalance[user] -= amount
            if (rand < .5) {
                lost++
                global.userBalance[user] += amount * 0
            }
            else if (rand > .5) {
                won++
                global.userBalance[user] += amount * 2
            }
            else {
                await interaction.followUp(".5 ty lucky mrdko")
            }
        }
        interaction.editReply(`${interaction.user.username} has ${global.userBalance[user]} OnCoins; Won ${won}x, Lost ${lost}x`)
    }
} as CommandOptions