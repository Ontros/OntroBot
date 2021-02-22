//const lang = require('./language.json')
module.exports = (id: number, textId: string) => {
    var server = global.servers[id]
    const {langJ} = global
    if(!langJ.translations[textId]) {
        throw new Error(`Unknown text ID "${textId}"`)
    }

    if (server.language == 'dev' && !langJ.translations[textId][server.language.toLowerCase()]) {
        return langJ.translations[textId]["czech"]
    }

    return langJ.translations[textId][server.language.toLowerCase()]
}