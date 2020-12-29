const lang = require('./language.json')
module.exports = (id, textId) => {
    if(!lang.translations[textId]) {
        throw new Error(`Unknown text ID "${textId}"`)
    }

    if (servers[id].language == 'dev' && !lang.translations[textId][servers[id].language.toLowerCase()]) {
        return lang.translations[textId]["czech"]
    }

    return lang.translations[textId][servers[id].language.toLowerCase()]
}