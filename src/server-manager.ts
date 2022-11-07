import { Server } from "./types";

//const fs = require('fs');
module.exports = (id: string, change: boolean) => {
    try {
        if (change != null && change == true) {
            updateServerFile(id, global.servers[id]);
        }
        checkServer(id);
        if (!global.servers[id]) {
            readServer(id);
        }
    }
    catch (e) {
        console.log('Error with opening/writing to data -> loading default server!');
        console.log(e);
        global.servers[id] = defaultServer;
    }
}
const defaultServer: Server = {
    queue: [],
    dispathcher: undefined,
    loop: 0,
    connection: undefined,
    playing: true,
    volume: 5,
    language: "english",
    cekarnaChannel: "",
    cekarnaPings: [],
    steps: [],
    playlists: undefined,
    prefix: '_',
    logServer: false,
    player: undefined,
    audioResource: undefined
    // config: {
    //     rules: { channelID: null, roleID: null }
    // }
}

var checkOnLoad = ['steps', 'playlists', 'prefix']

function checkServer(id: string) {
    //Existuje soubor?
    if (!global.fs.existsSync('./data/' + id + '.json')) {
        //Vytvoř ho
        global.fs.writeFileSync('./data/' + id + '.json', JSON.stringify(defaultServer), (err: Error) => {
            if (err) {
                console.log(err);
            }
        });
        // console.log('WRITING NEW!');
    }
}

function updateServerFile(id: string, server: Server) {
    console.log('WRITING!');
    //IGNORE: connection, dispatcher, audioResource, player, playing, queue
    var localServer: Server = Object.assign({}, server)
    localServer.connection = undefined
    localServer.dispathcher = undefined
    localServer.audioResource = undefined
    localServer.player = undefined
    localServer.playing = false
    localServer.queue = []
    global.fs.writeFileSync('./data/' + id + '.json', JSON.stringify(localServer), (err: Error) => {
        if (err) {
            console.log(err);
        }
    });
}

function readServer(id: string) {
    const server = require('./../data/' + id + '.json');
    // console.log('READING!');
    // if (!server.roles) {
    //     server.roles = []
    // }
    for (var childName of checkOnLoad) {
        if (server[childName] === undefined) {
            //@ts-expect-error
            server[childName] = defaultServer[childName]
        }
    }
    // if (!server.config) {
    //     // console.log(`defualt config + ${id}`)
    //     server.config = defaultServer.config;
    // }
    //handle legacy
    if (typeof server.loop === 'boolean') {
        server.loop = 0
    }
    //save to memory
    global.servers[id] = server;
}