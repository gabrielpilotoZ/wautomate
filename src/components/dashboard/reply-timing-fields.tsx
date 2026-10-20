"use client";

import { useId } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { type ReplyTiming } from "@/lib/reply-timing";

export function ReplyTimingFields({ value, onChange, global = false, disabled = false }: {
    value: ReplyTiming; onChange: (value: ReplyTiming) => void; global?: boolean; disabled?: boolean;
}) {
    const id = useId();
    const update = (fields: Partial<ReplyTiming>) => onChange({ ...value, ...fields });
    const inherited = value.replyDelayMode === "INHERIT";
    const random = value.replyDelayMode === "RANDOM";
    return <fieldset disabled={disabled} className="space-y-4 rounded-xl border p-4">
        <legend className="px-2 font-semibold">Tempo de resposta e digitação</legend>
        <div className="space-y-2">
            <Label htmlFor={`${id}-mode`}>Quando enviar a resposta</Label>
            <select id={`${id}-mode`} className="h-10 w-full rounded-md border bg-background px-3 text-sm" value={value.replyDelayMode} onChange={e => update({ replyDelayMode: e.target.value })}>
                {!global && <option value="INHERIT">Usar tempo das configurações gerais</option>}
                <option value="FIXED">Tempo fixo</option>
                <option value="RANDOM">Tempo aleatório</option>
            </select>
        </div>
        {!inherited && <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
                <Label htmlFor={`${id}-min`}>{random ? "Mínimo (segundos)" : "Aguardar (segundos)"}</Label>
                <Input id={`${id}-min`} type="number" min={0} max={300} step={1} value={Number.isNaN(value.replyDelayMinSeconds) ? "" : value.replyDelayMinSeconds} onChange={e => update({ replyDelayMinSeconds: e.target.valueAsNumber })} />
            </div>
            {random && <div className="space-y-2">
                <Label htmlFor={`${id}-max`}>Máximo (segundos)</Label>
                <Input id={`${id}-max`} type="number" min={0} max={300} step={1} value={Number.isNaN(value.replyDelayMaxSeconds) ? "" : value.replyDelayMaxSeconds} onChange={e => update({ replyDelayMaxSeconds: e.target.valueAsNumber })} />
            </div>}
        </div>}
        <p className="text-xs text-muted-foreground">{inherited ? "Mudanças no padrão geral passam a valer nesta regra." : random ? "Um novo tempo é sorteado para cada resposta. Exemplo: entre 5 e 10 segundos." : "Use 0 para responder sem espera."} Limite: 300 segundos. O servidor precisa permanecer ligado durante a espera.</p>
        {!global && <div className="flex items-center justify-between gap-3">
            <Label htmlFor={`${id}-inherit`}>Usar padrão geral de “digitando”</Label>
            <Switch id={`${id}-inherit`} disabled={disabled} checked={value.replyTypingEnabled === null} onCheckedChange={checked => update({ replyTypingEnabled: checked ? null : false })} />
        </div>}
        {(global || value.replyTypingEnabled !== null) && <div className="flex items-center justify-between gap-3">
            <div>
                <Label htmlFor={`${id}-typing`}>Mostrar “digitando” antes de responder</Label>
                <p className="mt-1 text-xs text-muted-foreground">Aparece durante a espera. Use um tempo maior que 0 para que seja perceptível.</p>
            </div>
            <Switch id={`${id}-typing`} disabled={disabled} checked={value.replyTypingEnabled ?? false} onCheckedChange={checked => update({ replyTypingEnabled: checked })} />
        </div>}
    </fieldset>;
}
