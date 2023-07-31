import { Message, } from "discord.js";
import createEmbed from "./createEmbed";

export default (message: Message, title: string, description: (string | null), status: number, imageURL?: (string | null)) => {
    var progressBar = ''
    status = Math.round(status * 19)
    for (var i = 0; i < 20; i++) {
        if (status != i) {
            progressBar += '▬'
        }
        else {
            progressBar += '🔘'
        }
    }
    const output = createEmbed(message, title, description + '\n' + progressBar, [], imageURL)
    return output
}