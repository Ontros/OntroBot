// Server-specific message hooks.
// Call registerServerMessageHook(guildId, async (message) => { ... }) to add behavior for a specific server.
// Each hook receives every non-bot message from that guild.
import { EmbedBuilder, TextChannel, Attachment } from 'discord.js';
import { registerServerMessageHook } from './index';
import db from '../database';

const getHoneypot = db.prepare(`SELECT * FROM honeypot WHERE guild_id = ?`);

export async function handleHoneypot(message: import('discord.js').Message): Promise<void> {
    if (!message.guildId || message.author.bot) return;

    const config = getHoneypot.get(message.guildId) as any;
    if (!config || config.channel_id !== message.channelId) return;

    const guild = message.guild;
    if (!guild) return;

    const author = message.author;
    const member = message.member;

    const logChannel = guild.channels.cache.get(config.log_channel_id) as TextChannel | undefined;
    if (logChannel) {
        const embed = new EmbedBuilder()
            .setColor(0xff0000)
            .setTitle('Honeypot triggered')
            .addFields(
                { name: 'User', value: `${author.tag} (<@${author.id}>)`, inline: true },
                { name: 'User ID', value: author.id, inline: true },
                { name: 'Message', value: message.content || '*no text*' }
            )
            .setTimestamp(message.createdAt);

        if (author.avatarURL()) embed.setThumbnail(author.avatarURL());

        const attachmentUrls = message.attachments.map((a: Attachment) => a.url);
        if (attachmentUrls.length > 0) {
            embed.addFields({ name: 'Attachments', value: attachmentUrls.join('\n') });
        }

        const files = message.attachments.map((a: Attachment) => ({
            attachment: a.url,
            name: a.name ?? 'attachment'
        }));

        await logChannel.send({ embeds: [embed], files }).catch(e => console.error('Honeypot log error:', e));
    }

    if (member) {
        await member.ban({ deleteMessageSeconds: 86400, reason: 'Honeypot channel' })
            .catch(e => console.error('Honeypot ban error:', e));
    }
}

// Example: delete embed-only messages from a specific user on a specific server.
// registerServerMessageHook('GUILD_ID_HERE', async (message) => {
//     if (message.author.id === 'USER_ID_HERE' && message.embeds.length > 0 && !message.content) {
//         await message.delete().catch(() => {});
//     }
// });

let emojiId: string;
let emojiStr: string;
// H_Gnomus mirroring
registerServerMessageHook('1483929130088005763', async (message) => {
    if (message.author.bot) return;
    const match = message.content.match(/<:H_Gnome:(\d+)>/);
    if (match) {
        emojiStr = match[0];
        emojiId = match[1];
        await Promise.all([
            message.react(`H_Gnome:${emojiId}`).catch((e) => console.error('H_Gnome react error:', e)),
            message.reply(emojiStr).catch((e) => console.error('H_Gnome reply error:', e)),
        ]);
    }
    else if (["theo", "gnom"].some((str=>message.content.toLowerCase().includes(str))))
    {
        if (!emojiId) return;
        message.react(`H_Gnome:${emojiId}`).catch((e) => console.error('H_Gnome react error:', e))
    }
});

// Spodina smazani leveled zprav
registerServerMessageHook('1483929130088005763', async (message) => {
    if (message.author.id === '172002275412279296' && message.content.includes('leveled')) {
        console.log('deleting message', message)
        await message.delete().catch(() => { });
    }
})