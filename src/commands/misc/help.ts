import { Message } from "discord.js";

module.exports = {
    commands: ['help'],
    callback: (message: Message, args: string[], text: string) => {
        var helpMessage = "";
        helpMessage += "1. _ping" + '\n';
        helpMessage += "2. _play" + '\n';
        helpMessage += "3. _skip" + '\n';
        helpMessage += "4. _stop" + '\n';
        helpMessage += "5. _queue" + '\n';
        helpMessage += "6. _volume" + '\n';
        helpMessage += "7. _loop" + '\n';
        message.channel.send(helpMessage);
    },
    permissions: [],
    requiredRoles: [],
    allowedIDs: [],
}