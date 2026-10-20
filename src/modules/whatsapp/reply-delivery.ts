type Presence = (state: "composing" | "paused", jid: string) => Promise<unknown>;

// Renew composing while waiting: WhatsApp expires the indicator after a few seconds.
// A presence failure must never prevent delivery of the actual reply.
export async function deliverReply({ jid, delayMs, typing, presence, send, sleep = ms => new Promise<void>(resolve => setTimeout(resolve, ms)) }: {
    jid: string; delayMs: number; typing: boolean; presence: Presence;
    send: () => Promise<void>; sleep?: (ms: number) => Promise<void>;
}) {
    try {
        let remaining = delayMs;
        do {
            if (typing) await presence("composing", jid).catch(() => {});
            const interval = typing ? Math.min(remaining, 8000) : remaining;
            if (interval > 0) await sleep(interval);
            remaining -= interval;
        } while (remaining > 0);
        await send();
    } finally {
        if (typing) await presence("paused", jid).catch(() => {});
    }
}
