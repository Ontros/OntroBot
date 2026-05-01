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

try { db.exec(`ALTER TABLE word_football_state ADD COLUMN streak_length INTEGER DEFAULT 0`); } catch {}
try { db.exec(`ALTER TABLE word_football_state ADD COLUMN best_streak INTEGER DEFAULT 0`); } catch {}

db.exec(`CREATE TABLE IF NOT EXISTS dictionary (
    word TEXT PRIMARY KEY
)`);

db.exec(`CREATE INDEX IF NOT EXISTS idx_dictionary_word ON dictionary(word COLLATE NOCASE)`);

const userWfStatsColumns = (db.prepare(`PRAGMA table_info(user_wf_stats)`).all() as any[]).map((c: any) => c.name);
if (!userWfStatsColumns.includes('guild_id')) {
    db.exec(`DROP TABLE IF EXISTS user_wf_stats`);
    db.exec(`CREATE TABLE user_wf_stats (
        guild_id TEXT NOT NULL,
        user_id TEXT NOT NULL,
        successful_words INTEGER DEFAULT 0,
        total_word_length INTEGER DEFAULT 0,
        streaks_broken INTEGER DEFAULT 0,
        PRIMARY KEY (guild_id, user_id)
    )`);
} else {
    db.exec(`CREATE TABLE IF NOT EXISTS user_wf_stats (
        guild_id TEXT NOT NULL,
        user_id TEXT NOT NULL,
        successful_words INTEGER DEFAULT 0,
        total_word_length INTEGER DEFAULT 0,
        streaks_broken INTEGER DEFAULT 0,
        PRIMARY KEY (guild_id, user_id)
    )`);
}

export default db;
