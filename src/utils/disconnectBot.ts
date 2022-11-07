export default async (guildId: string | undefined) => {
    if (!guildId) {
        return 0
    }
    const server = global.servers[guildId]
    server.playing = false
    if (server.connection) {
        server.connection.disconnect()
        server.connection = undefined
    }
    if (server.audioResource) {
        server.audioResource = undefined
    }
    if (server.dispathcher) {
        server.dispathcher = undefined
    }
    if (server.player) {
        server.player = undefined
    }
    return 1
}