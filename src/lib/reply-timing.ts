export interface ReplyTiming {
    replyDelayMode: string;
    replyDelayMinSeconds: number;
    replyDelayMaxSeconds: number;
    replyTypingEnabled: boolean | null;
}

export const globalReplyTiming: ReplyTiming = {
    replyDelayMode: "FIXED", replyDelayMinSeconds: 0, replyDelayMaxSeconds: 0, replyTypingEnabled: false,
};
export const inheritedReplyTiming: ReplyTiming = { ...globalReplyTiming, replyDelayMode: "INHERIT", replyTypingEnabled: null };

export class ReplyTimingError extends Error {}

// Validate only these fields; merge omitted fields with the current stored values.
export function parseReplyTiming(input: Partial<ReplyTiming>, current: ReplyTiming = inheritedReplyTiming, global = false): ReplyTiming {
    const result: ReplyTiming = {
        replyDelayMode: current.replyDelayMode,
        replyDelayMinSeconds: current.replyDelayMinSeconds,
        replyDelayMaxSeconds: current.replyDelayMaxSeconds,
        replyTypingEnabled: current.replyTypingEnabled,
    };
    for (const key of Object.keys(globalReplyTiming) as (keyof ReplyTiming)[]) {
        if (input[key] !== undefined) Object.assign(result, { [key]: input[key] });
    }
    if (!(global ? ["FIXED", "RANDOM"] : ["INHERIT", "FIXED", "RANDOM"]).includes(result.replyDelayMode)) {
        throw new ReplyTimingError("Selecione um tipo de tempo válido.");
    }
    for (const value of [result.replyDelayMinSeconds, result.replyDelayMaxSeconds]) {
        if (!Number.isInteger(value) || value < 0 || value > 300) {
            throw new ReplyTimingError("O tempo deve ser um número inteiro entre 0 e 300 segundos.");
        }
    }
    if (result.replyDelayMode === "RANDOM" && result.replyDelayMaxSeconds < result.replyDelayMinSeconds) {
        throw new ReplyTimingError("O tempo máximo deve ser maior ou igual ao mínimo.");
    }
    if (typeof result.replyTypingEnabled !== "boolean" && (global || result.replyTypingEnabled !== null)) {
        throw new ReplyTimingError("Selecione uma opção válida para mostrar digitando.");
    }
    return result;
}

export function resolveReplyTiming(rule: ReplyTiming, defaults: ReplyTiming | null, random = Math.random) {
    const global = defaults ?? globalReplyTiming;
    const source = rule.replyDelayMode === "INHERIT" ? global : rule;
    const seconds = source.replyDelayMode === "RANDOM"
        ? source.replyDelayMinSeconds + Math.floor(random() * (source.replyDelayMaxSeconds - source.replyDelayMinSeconds + 1))
        : source.replyDelayMinSeconds;
    return { delayMs: seconds * 1000, typing: rule.replyTypingEnabled ?? global.replyTypingEnabled ?? false };
}
