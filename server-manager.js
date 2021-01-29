const fs = require('fs');
module.exports = (id, change) => {
    try {
        if (change != null && change == true) {
            updateServerFile(id);
        }
        checkServer(id);
        if (!servers[id]) {
            readServer(id);
        }
    }
    catch (e) {
        console.log(e);
        console.log('Error with opening/writing to data -> loading default server!');
        servers[id] = defaultServer;
    }
}
const defaultServer = {
    queue: [],
    dispathcher: [],
    loop: false,
    connection: [],
    playing: true,
    volume: 5,
    language: "english",
    cekarnaChannel: "",
    cekarnaPings: []
}
function checkServer(id) 
{
    //Existuje soubor?
    if (!fs.existsSync('./data/'+id+'.json')) {
        //Vytvoř ho
        fs.writeFileSync('./data/'+id+'.json', JSON.stringify(defaultServer), err => {
            if (err) {
                console.log(err);
            }
        });
        console.log('WRITING!');
    }
}

function updateServerFile(id) {
    console.log('WRITING!');
    var server = servers[id];
    var connection = server.connection;
    server.connection = [];
    var dispathcher = server.dispathcher;
    server.dispathcher = [];
    var loop = server.loop;
    server.loop = false;
    var playing = server.playing;
    server.playing = true;
    var queue = server.queue;
    server.queue = [];
    fs.writeFileSync('./data/'+id+'.json', JSON.stringify(server), err => {
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

function readServer(id) {
    const server = require('./data/'+id+'.json');
    console.log('READING!');
    servers[id] = server;
}