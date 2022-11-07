import { Message } from "discord.js";

module.exports = {
    commands: ['test'],
    expectedArgs: '',
    minArgs: 0,
    maxArgs: 1,
    permissions: [],
    requiredRoles: [],
    callback: async (message: Message, Arguments: string[], text: string) => {
        // message.reply("toast")
        const data = ['Krkonoše', "Hrubý jeseník", "Králický sněžník", "Šumava", "Moravskoslezské Beskydy", "Krušné hory", "Český les", "Novohradské hory", "Jizerské hory", "Orlické hory", "Rychlebské hory", "Javorníky", "Bílé karpaty", "Českémoravská vrchovina", "Brdy", "Doupavské hory", "České středohoří", "Polabská nížina", "Dyjsko-vratecký úval", "Dolnomoravský úval", "Hornomoravský úval", "Českobudějovická", "Třeboňská pánev", "Ostravská pánev"]
        var out = ""
        for (var i = 0; i < parseInt(Arguments[0]); i++) {
            var id = Math.round((data.length - 1) * Math.random())
            out += `||${id + 1}||. ${data[id]}\n`
        }
        message.channel.send(out)
        //@ts-ignore
        // global.serverManager(message.guild.id)
        //@ts-ignore
        // console.log(global.servers[message.guild.id])
        // message.channel.send(global.createEmbed(message, "F1 role", "Vyber si role:\n✅ - Viděl jsem poslední GP\n🐴 - Jsem Ferrari fan\n🐂 - Jsem Red Bull fan", []))
    },
    allowedIDs: ['255345748441432064', '275639448299896833', '468845827352166430', '630088178774179871', '275626532507090944']
}