import { Message } from 'discord.js';

type ServerMessageHook = (message: Message) => Promise<void>;

const hooks = new Map<string, ServerMessageHook[]>();

export function registerServerMessageHook(guildId: string, hook: ServerMessageHook): void {
    const existing = hooks.get(guildId) ?? [];
    existing.push(hook);
    hooks.set(guildId, existing);
}

export async function runServerMessageHooks(message: Message): Promise<void> {
    if (!message.guildId) return;
    for (const hook of hooks.get(message.guildId) ?? []) {
        await hook(message);
    }
}
