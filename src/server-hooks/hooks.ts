// Server-specific message hooks.
// Call registerServerMessageHook(guildId, async (message) => { ... }) to add behavior for a specific server.
// Each hook receives every non-bot message from that guild.
import { registerServerMessageHook } from './index';

// Example: delete embed-only messages from a specific user on a specific server.
// registerServerMessageHook('GUILD_ID_HERE', async (message) => {
//     if (message.author.id === 'USER_ID_HERE' && message.embeds.length > 0 && !message.content) {
//         await message.delete().catch(() => {});
//     }
// });

// H_Gnomus mirroring
registerServerMessageHook('1483929130088005763', async (message) => {
    const match = message.content.match(/<:H_Gnomus:(\d+)>/);
    if (!match) return;
    const emojiStr = match[0];
    const emojiId = match[1];
    await Promise.all([
        message.react(`H_Gnomus:${emojiId}`).catch(() => {}),
        message.reply(emojiStr).catch(() => {}),
    ]);
});

// Spodina smazani leveled zprav
registerServerMessageHook('1483929130088005763', async (message) => {
    if (message.author.id === '172002275412279296' && message.content.includes('leveled')) {
        console.log('deleting message', message)
        await message.delete().catch(() => { });
    }
})