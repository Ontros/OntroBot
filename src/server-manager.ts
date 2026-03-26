import Database from 'better-sqlite3';
import { Server } from "./types";

const defaultServer: Server = {
    language: "english",
    cekarnaChannel: "",
    cekarnaPings: [],
    steps: [],
    prefix: '_',
    logServer: false
}

const db = new Database('./servers.db');

db.exec(`CREATE TABLE IF NOT EXISTS servers (
    id TEXT PRIMARY KEY,
    language TEXT DEFAULT 'english',
    cekarnaChannel TEXT DEFAULT '',
    cekarnaPings TEXT DEFAULT '[]',
    steps TEXT DEFAULT '[]',
    prefix TEXT DEFAULT '_',
    logServer INTEGER DEFAULT 0
)`);

const insertOrReplace = db.prepare(`INSERT OR REPLACE INTO servers (id, language, cekarnaChannel, cekarnaPings, steps, prefix, logServer) VALUES (?, ?, ?, ?, ?, ?, ?)`);

const selectServer = db.prepare(`SELECT * FROM servers WHERE id = ?`);

export default (id: string, change?: boolean) => {
    try {
        if (change != null && change == true) {
            updateServerDB(id, global.servers[id]);
        }
        if (!global.servers[id]) {
            readServerDB(id);
        }
    }
    catch (e) {
        console.log('Error with database -> loading default server!');
        console.log(e);
        global.servers[id] = { ...defaultServer };
    }
}

function updateServerDB(id: string, server: Server) {
    const cekarnaPings = JSON.stringify(server.cekarnaPings);
    const steps = JSON.stringify(server.steps);
    const logServer = server.logServer ? 1 : 0;
    insertOrReplace.run(id, server.language, server.cekarnaChannel, cekarnaPings, steps, server.prefix, logServer);
}

function readServerDB(id: string) {
    const row = selectServer.get(id) as any;
    if (row) {
        global.servers[id] = {
            language: row.language,
            cekarnaChannel: row.cekarnaChannel,
            cekarnaPings: JSON.parse(row.cekarnaPings),
            steps: JSON.parse(row.steps),
            prefix: row.prefix,
            logServer: row.logServer === 1
        };
    } else {
        global.servers[id] = { ...defaultServer };
        updateServerDB(id, global.servers[id]);
    }
}