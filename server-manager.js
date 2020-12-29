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
    catch {
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
    server.connection = [];
    server.dispathcher = [];
    server.loop = false;
    server.playing = true;
    fs.writeFileSync('./data/'+id+'.json', JSON.stringify(servers[id]), err => {
        if (err) {
            console.log(err);
        }
    });
}

function readServer(id) {
    const server = require('./data/'+id+'.json');
    console.log('READING!');
    servers[id] = server;
}