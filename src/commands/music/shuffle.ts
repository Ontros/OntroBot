import { Message } from "discord.js";

module.exports = {
    commands: ['shuffle'],
    permissions: [],
    requiredRoles: [],
    requireChannelPerms: false,
    maxArgs: 0,
    minArgs: 0,
    allowedIDs: [],
    callback: async (message: Message, args: string[], text: string) => {
        if (!message.guild) { return }
        var server = global.servers[message.guild.id];
        const { lang } = global;
        if (!server.queue) {
            message.channel.send(lang(message.guild.id, "NO_PLAY"));
            return;
        }
        server.queue = shuffle(server.queue)
        message.channel.send(lang(message.guild.id, 'SHUFFLED'));
    },
}

function shuffle(array: Array<any>) {
    var currentIndex = array.length, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }

    return array;
}