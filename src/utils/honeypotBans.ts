import db from "../database";

const BAN_DURATION_MS = 60 * 60 * 1000;

const insertBan = db.prepare(`INSERT OR REPLACE INTO honeypot_bans (guild_id, user_id, unban_ts) VALUES (?, ?, ?)`);
const deleteBan = db.prepare(`DELETE FROM honeypot_bans WHERE guild_id = ? AND user_id = ?`);
const getAllBans = db.prepare(`SELECT guild_id, user_id, unban_ts FROM honeypot_bans`);

const timers = new Map<string, NodeJS.Timeout>();

async function unban(guildId: string, userId: string): Promise<void> {
    timers.delete(`${guildId}:${userId}`);
    const guild = global.bot.guilds.cache.get(guildId);
    if (guild) {
        await guild.bans.remove(userId, 'Honeypot ban expired').catch(e => console.error('Honeypot unban error:', e));
    }
    deleteBan.run(guildId, userId);
}

function scheduleUnban(guildId: string, userId: string, unbanTs: number): void {
    const key = `${guildId}:${userId}`;
    const existing = timers.get(key);
    if (existing) clearTimeout(existing);
    const delay = Math.max(0, unbanTs - Date.now());
    timers.set(key, setTimeout(() => unban(guildId, userId), delay));
}

export function recordHoneypotBan(guildId: string, userId: string): void {
    const unbanTs = Date.now() + BAN_DURATION_MS;
    insertBan.run(guildId, userId, unbanTs);
    scheduleUnban(guildId, userId, unbanTs);
}

export function restorePendingHoneypotUnbans(): void {
    const rows = getAllBans.all() as { guild_id: string; user_id: string; unban_ts: number }[];
    for (const row of rows) scheduleUnban(row.guild_id, row.user_id, row.unban_ts);
}
