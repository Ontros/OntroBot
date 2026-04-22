import { Server } from "./types";
import db from "./database";

const defaultServer: Server = {
    language: "english",
    cekarnaChannel: "",
    cekarnaPings: [],
    steps: [],
    prefix: '_',
    logServer: false
}

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
            language: row.language as any,
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