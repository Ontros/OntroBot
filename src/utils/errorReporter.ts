import { TextChannel } from "discord.js";

const origError = console.error.bind(console);
const queue: string[] = [];
let ready = false;
let sending = false;

function format(args: unknown[]): string {
    return args.map(a => {
        if (a instanceof Error) return a.stack ?? a.message;
        if (typeof a === 'string') return a;
        try { return JSON.stringify(a, null, 2); } catch { return String(a); }
    }).join(' ');
}

async function flush(): Promise<void> {
    if (sending || !ready || queue.length === 0) return;
    const channelId = process.env.ERROR_CHANNEL;
    if (!channelId) { queue.length = 0; return; }

    sending = true;
    try {
        const channel = await global.bot.channels.fetch(channelId).catch(() => null);
        if (!channel || !channel.isSendable()) { queue.length = 0; return; }
        while (queue.length > 0) {
            const body = queue.shift()!.slice(0, 1900);
            await (channel as TextChannel).send('```\n' + body + '\n```').catch(origError);
        }
    } catch (e) {
        origError('errorReporter flush failed:', e);
    } finally {
        sending = false;
    }
}

export function initErrorReporter(): void {
    console.error = (...args: unknown[]) => {
        origError(...args);
        queue.push(format(args));
        void flush();
    };

    process.on('uncaughtException', (err, origin) => {
        console.error(`uncaughtException (${origin}):`, err);
    });
    process.on('unhandledRejection', (reason) => {
        console.error('unhandledRejection:', reason);
    });
}

export function markErrorReporterReady(): void {
    ready = true;
    void flush();
}
