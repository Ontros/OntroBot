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
        console.log(e);
        console.log('Error with opening/writing to data -> loading default server!');
        global.servers[id] = defaultServer;
    }
}
const defaultServer = {
    queue: [],
    dispathcher: undefined,
    loop: false,
    connection: undefined,
    playing: true,
    volume: 5,
    language: "english",
    cekarnaChannel: "",
    cekarnaPings: [],
    steps: []
}
function checkServer(id: string) 
{
    //Existuje soubor?
    if (!global.fs.existsSync('./data/'+id+'.json')) {
        //Vytvoř ho
        global.fs.writeFileSync('./data/'+id+'.json', JSON.stringify(defaultServer), (err: Error) => {
            if (err) {
                console.log(err);
            }
        });
        console.log('WRITING!');
    }
}

function updateServerFile(id:string) {
    console.log('WRITING!');
    var server = global.servers[id];
    var connection = server.connection;
    server.connection = undefined;
    var dispathcher = server.dispathcher;
    server.dispathcher = undefined;
    var loop = server.loop;
    server.loop = false;
    var playing = server.playing;
    server.playing = true;
    var queue = server.queue;
    server.queue = [];
    global.fs.writeFileSync('./data/'+id+'.json', JSON.stringify(server), (err: Error) => {
        if (err) {
            console.log(err);
        }
    });
    server.connection = connection;
    server.dispathcher = dispathcher;
    server.loop = loop;
    server.playing = playing;
    server.queue = queue;
}

function readServer(id:string) {
    const server = require('./../data/'+id+'.json');
    console.log('READING!');
    if (!server.roles) {
        server.roles = []
    }
    global.servers[id] = server;
}