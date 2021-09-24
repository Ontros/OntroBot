import { Server } from "./types";

//const fs = require('fs');
module.exports = (id: string, change: boolean) => {
    try {
        if (change != null && change == true) {
            updateServerFile(id);
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
    scheaduledTimes: [],
    playlists: undefined
    // config: {
    //     rules: { channelID: null, roleID: null }
    // }
}
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

function updateServerFile(id: string) {
    //WARNING: This code is awful
    // console.log('WRITING!');
    var server = global.servers[id];
    var connection = server.connection;
    server.connection = undefined;
    var dispathcher = server.dispathcher;
    server.dispathcher = undefined;
    //var loop = server.loop;
    //server.loop = 0;
    var playing = server.playing;
    server.playing = true;
    var queue = server.queue;
    server.queue = [];
    console.log(JSON.stringify(server))
    console.log(server)
    global.fs.writeFileSync('./data/' + id + '.json', JSON.stringify(server), (err: Error) => {
        if (err) {
            console.log(err);
        }
    });
    server.connection = connection;
    server.dispathcher = dispathcher;
    //server.loop = loop;
    server.playing = playing;
    server.queue = queue;
}

function readServer(id: string) {
    const server = require('./../data/' + id + '.json');
    // console.log('READING!');
    if (!server.roles) {
        server.roles = []
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