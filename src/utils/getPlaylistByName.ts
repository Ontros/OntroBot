export default (guildId: string, name: string) => {
    var index = global.servers[guildId].playlists?.findIndex((value) => { return value.name === name })
    if (index === undefined || index === -1 || !global.servers[guildId].playlists) {
        return undefined
    }
    return global.servers[guildId].playlists?.[index]
}