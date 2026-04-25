import Database from 'better-sqlite3';

const db = new Database('./servers.db');

db.pragma('journal_mode = WAL');

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

db.exec(`CREATE TABLE IF NOT EXISTS word_football_state (
    guild_id TEXT PRIMARY KEY,
    channel_id TEXT,
    last_word TEXT,
    last_user TEXT,
    used_words TEXT DEFAULT '[]'
)`);

db.exec(`CREATE TABLE IF NOT EXISTS dictionary (
    word TEXT PRIMARY KEY
)`);

db.exec(`CREATE INDEX IF NOT EXISTS idx_dictionary_word ON dictionary(word COLLATE NOCASE)`);

db.exec(`CREATE TABLE IF NOT EXISTS user_wf_stats (
    user_id TEXT PRIMARY KEY,
    successful_words INTEGER DEFAULT 0,
    total_word_length INTEGER DEFAULT 0,
    streaks_broken INTEGER DEFAULT 0
)`);

export default db;