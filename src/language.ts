//const lang = require('./language.json')
module.exports = (id: string, textId: string) => {
    var server = global.servers[id]
    const { langJ } = global
    if (!langJ.translations[textId]) {
        throw new Error(`Unknown text ID "${textId}"`)
    }

    if (server.language == 'dev' && !langJ.translations[textId]['dev']) {
        return langJ.translations[textId]["czech"]
    }
    const output = langJ.translations[textId][server.language]

    if (!output) { console.log(textId); return "NO TRANSLATION" }
    return output
}