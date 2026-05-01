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
