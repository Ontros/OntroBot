//const lang = require('./language.json')
import { Message } from "discord.js"
import languageDATA from "./languageDATA"
type Translations = keyof typeof languageDATA.translations

export default (message: Message, textId: Translations): string => {
    if (!message.guildId) {
        console.log("Missing guild id"); return "NO TRANSLATION"
    }
    var server = global.servers[message.guildId]
    if (!languageDATA.translations[textId]) {
        throw new Error(`Unknown text ID "${textId}"`)
    }

    if (server.language == 'dev' && !(languageDATA.translations[textId] as { english: string; czech: string; dev: string }).dev) {
        return languageDATA.translations[textId].czech as string
    }
    const output = (languageDATA.translations[textId] as { english: string; czech: string; dev: string })[server.language]

    if (!output) { console.log(textId); return "NO TRANSLATION" }
    return output
}