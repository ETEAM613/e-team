"use client";

import { useActionState, useState } from "react";
import { CalendarClock } from "lucide-react";
import { saveAvailability } from "@/app/actions/lessons";
import FormError from "@/components/FormError";
import { btn, input } from "@/components/ui";
import { BANDS, TIMEZONES } from "@/lib/time";

// Ordre d'affichage : dimanche → vendredi, puis samedi (Chabbat, souvent vide)
const DAYS = [
  { w: 0, label: "Dim" },
  { w: 1, label: "Lun" },
  { w: 2, label: "Mar" },
  { w: 3, label: "Mer" },
  { w: 4, label: "Jeu" },
  { w: 5, label: "Ven" },
  { w: 6, label: "Sam" },
];

const hh = (h: number) => `${String(h).padStart(2, "0")}h`;

export default function AvailabilityEditor({ initial, timezone }: { initial: string[]; timezone: string }) {
  const [cells, setCells] = useState<Set<string>>(new Set(initial));
  const [showNight, setShowNight] = useState(initial.some((c) => Number(c.split("-")[1]) < 6));
  const [state, action, pending] = useActionState(saveAvailability, undefined);

  const toggle = (key: string) =>
    setCells((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });

  const toggleBand = (w: number, from: number, to: number) =>
    setCells((prev) => {
      const next = new Set(prev);
      const keys = Array.from({ length: to - from }, (_, i) => `${w}-${from + i}`);
      const allOn = keys.every((k) => next.has(k));
      keys.forEach((k) => (allOn ? next.delete(k) : next.add(k)));
      return next;
    });

  const bands = BANDS.filter((b) => b.key !== "nuit" || showNight);

  return (
    <form action={action} className="space-y-4">
      {[...cells].map((c) => (
        <input key={c} type="hidden" name="slot" value={c} />
      ))}

      <div className="flex flex-wrap items-end gap-3">
        <label className="block">
          <span className="mb-1 block text-xs font-bold text-muted">Mon fuseau horaire</span>
          <select name="timezone" defaultValue={timezone} className={`${input} !py-2.5`}>
            {TIMEZONES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </label>
        <p className="flex-1 text-sm text-muted">
          Cliquez sur les heures où vous êtes disponible chaque semaine. Les élèves les voient automatiquement dans leur propre heure.
        </p>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-line">
        <table className="w-full min-w-[560px] border-collapse text-center text-sm">
          <thead>
            <tr className="bg-surface">
              <th className="w-16 px-2 py-2 text-left text-xs font-bold text-muted">Heure</th>
              {DAYS.map((d) => (
                <th key={d.w} className="px-1 py-2 font-extrabold">{d.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {bands.map((b) => (
              <BandRows key={b.key} band={b} cells={cells} toggle={toggle} toggleBand={toggleBand} />
            ))}
          </tbody>
        </table>
      </div>

      <button type="button" onClick={() => setShowNight((v) => !v)} className="text-sm font-bold text-brand-600 hover:underline">
        {showNight ? "Masquer la nuit (0h – 6h)" : "Afficher aussi la nuit (0h – 6h)"}
      </button>

      <FormError state={state} />
      <button disabled={pending} className={btn.primary}>
        <CalendarClock className="h-5 w-5" /> {pending ? "Enregistrement…" : "Enregistrer mes disponibilités"}
      </button>
    </form>
  );
}

function BandRows({
  band,
  cells,
  toggle,
  toggleBand,
}: {
  band: (typeof BANDS)[number];
  cells: Set<string>;
  toggle: (k: string) => void;
  toggleBand: (w: number, from: number, to: number) => void;
}) {
  const hours = Array.from({ length: band.to - band.from }, (_, i) => band.from + i);
  return (
    <>
      <tr className="border-t border-line bg-brand-50/50">
        <td className="px-2 py-1.5 text-left text-xs font-extrabold text-brand-700">
          {band.label}
          <span className="block font-semibold text-muted">{hh(band.from)}–{hh(band.to % 24 || 24)}</span>
        </td>
        {DAYS.map((d) => (
          <td key={d.w} className="px-1 py-1">
            <button
              type="button"
              onClick={() => toggleBand(d.w, band.from, band.to)}
              className="w-full rounded-md py-1 text-[11px] font-bold text-brand-700 hover:bg-brand-100"
              title={`Tout ${band.label.toLowerCase()} le ${d.label}`}
            >
              tout
            </button>
          </td>
        ))}
      </tr>
      {hours.map((h) => (
        <tr key={h}>
          <td className="px-2 py-0.5 text-left text-xs font-semibold text-muted">{hh(h)}</td>
          {DAYS.map((d) => {
            const key = `${d.w}-${h}`;
            const on = cells.has(key);
            return (
              <td key={key} className="px-1 py-0.5">
                <button
                  type="button"
                  onClick={() => toggle(key)}
                  aria-pressed={on}
                  aria-label={`${d.label} ${hh(h)}`}
                  className={`h-7 w-full rounded-md transition ${on ? "bg-emerald-500 hover:bg-emerald-600" : "bg-surface hover:bg-emerald-100"}`}
                />
              </td>
            );
          })}
        </tr>
      ))}
    </>
  );
}
