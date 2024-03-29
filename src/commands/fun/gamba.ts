import { time } from "console";
import { Message } from "discord.js";

module.exports = {
    commands: ['gamba', 'g'],
    permissions: [],
    requiredRoles: [],
    allowedIDs: [],
    callback: async (message: Message, args: string[], text: string) => {
        if (!message.guild) { return }
        const { lang } = global;
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
            message.channel.send(`You have ${global.userBalance[user]} OnCoins\n If you want to gamba do _g <amount>`)
            return
        }
        if (isNaN(times) || times < 1 || times > 1000000) {
            message.channel.send("kokote")
            return
        }
        if (global.userBalance[user] < amount) {
            message.channel.send(`ur broke, lmao ratiod`)
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
                    message.channel.send(`${message.author.username} won ${amount * 0}; You now have ${global.userBalance[user]} OnCoins`)
            }
            else if (rand > .5) {
                won++
                global.userBalance[user] += amount * 3
                if (times === 1)
                    message.channel.send(`${message.author.username} won ${amount * 2}; You now have ${global.userBalance[user]} OnCoins`)
            }
            else {
                message.channel.send(".5")
            }
            // else if (rand < .5) {
            //     global.userBalance[user] += amount * 2.5
            //     if (times === 1)
            //         message.channel.send(`${message.author.username} won ${amount * 2.5}; You now have ${global.userBalance[user]} OnCoins`)
            // }
            // else {
            //     global.userBalance[user] += amount * .25
            //     if (times === 1)
            //         message.channel.send(`${message.author.username} won ${amount * .25}; You now have ${global.userBalance[user]} OnCoins`)
            // }
        }
        message.channel.send(`${message.author.username} has ${global.userBalance[user]} OnCoins; Won ${won}x, Lost ${lost}x`)
    }
}