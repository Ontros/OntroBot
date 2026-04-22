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

db.exec(`CREATE TABLE IF NOT EXISTS voice_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    guild_id TEXT,
    user_id TEXT,
    channel_id TEXT,
    action TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
)`);

const insertOrReplace = db.prepare(`INSERT OR REPLACE INTO servers (id, language, cekarnaChannel, cekarnaPings, steps, prefix, logServer) VALUES (?, ?, ?, ?, ?, ?, ?)`);

const selectServer = db.prepare(`SELECT * FROM servers WHERE id = ?`);

const insertVoiceLog = db.prepare(`INSERT INTO voice_logs (guild_id, user_id, channel_id, action) VALUES (?, ?, ?, ?)`);

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

// Exported function to write voice actions to the SQLite database
export function logVoiceAction(guildId: string, userId: string, channelId: string, action: string) {
    try {
        insertVoiceLog.run(guildId, userId, channelId, action);
    } catch (e) {
        console.error('Failed to write voice log to database:', e);
    }
}