"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { CalendarCheck, CheckCircle2, ChevronLeft, ChevronRight, Gift, Mail, Video, X } from "lucide-react";
import type { Teacher } from "@/lib/data";
import { btn } from "@/components/ui";
import GoogleIcon from "@/components/GoogleIcon";

const SLOTS: Record<string, string[]> = {
  matin: ["07:00", "08:00", "09:30", "11:00"],
  "apres-midi": ["14:00", "15:30", "17:00"],
  soir: ["19:30", "20:30", "21:30"],
};

const DAY_FMT = new Intl.DateTimeFormat("fr-FR", { weekday: "short" });
const DATE_FMT = new Intl.DateTimeFormat("fr-FR", { day: "numeric" });
const LONG_FMT = new Intl.DateTimeFormat("fr-FR", { weekday: "long", day: "numeric", month: "long" });

const subscribeNoop = () => () => {};
// Minuit aujourd'hui : valeur stable pendant la journée
const startOfToday = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.getTime();
};

export default function BookingWidget({ teacher }: { teacher: Teacher }) {
  const [type, setType] = useState<"essai" | "cours">("essai");
  const [weekOffset, setWeekOffset] = useState(0);
  const [selected, setSelected] = useState<{ day: Date; time: string } | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  // La date du jour est calculée côté navigateur pour éviter un décalage serveur/client
  const today = useSyncExternalStore(subscribeNoop, startOfToday, () => null);

  const days = useMemo(() => {
    if (today === null) return [];
    const start = new Date(today);
    start.setDate(start.getDate() + weekOffset * 7);
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return d;
    });
  }, [today, weekOffset]);

  const slotsFor = (d: Date) => {
    // Pas de cours pendant Chabbat
    if (d.getDay() === 6) return [];
    const all = teacher.available.flatMap((m) => SLOTS[m]);
    // Le vendredi, uniquement le matin
    if (d.getDay() === 5) return all.filter((s) => s < "12:00");
    // Variation stable pour simuler des créneaux déjà pris
    return all.filter((_, i) => (d.getDate() + i) % 3 !== 0);
  };

  const duration = type === "essai" ? 25 : 50;

  return (
    <div className="overflow-hidden rounded-[2rem] border border-line bg-white shadow-xl shadow-brand-500/10">
      <div className="bg-gradient-to-br from-brand-500 to-indigo-700 p-6 text-white">
        <p className="flex items-center gap-2 text-sm font-bold text-white/80">
          <Gift className="h-4 w-4" /> Premier cours offert
        </p>
        <p className="mt-1 font-display text-2xl font-extrabold">Réserver avec {teacher.name.split(" ").slice(0, 2).join(" ")}</p>
        <div className="mt-4 grid grid-cols-2 gap-1 rounded-full bg-white/15 p-1">
          {(["essai", "cours"] as const).map((k) => (
            <button
              key={k}
              onClick={() => setType(k)}
              className={`rounded-full px-3 py-2 text-sm font-bold transition ${type === k ? "bg-white text-ink" : "text-white/85 hover:text-white"}`}
            >
              {k === "essai" ? "Essai · 25 min" : "Cours · 50 min"}
            </button>
          ))}
        </div>
      </div>

      <div className="p-5 sm:p-6">
        <div className="flex items-center justify-between">
          <p className="font-bold">Choisissez un créneau</p>
          <div className="flex gap-1">
            <button
              onClick={() => setWeekOffset((w) => Math.max(0, w - 1))}
              disabled={weekOffset === 0}
              className="grid h-9 w-9 place-items-center rounded-full border border-line disabled:opacity-40"
              aria-label="Semaine précédente"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => setWeekOffset((w) => Math.min(3, w + 1))}
              className="grid h-9 w-9 place-items-center rounded-full border border-line"
              aria-label="Semaine suivante"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
        <p className="mt-1 text-xs text-muted">Heure de Paris · aucun cours pendant Chabbat</p>

        <div className="mt-4 grid min-h-40 grid-cols-7 gap-1 text-center">
          {days.map((d) => {
            const slots = slotsFor(d);
            return (
              <div key={d.toISOString()} className="min-w-0">
                <p className="text-[11px] font-bold uppercase text-muted">{DAY_FMT.format(d).replace(".", "")}</p>
                <p className="font-display text-base font-extrabold">{DATE_FMT.format(d)}</p>
                <div className="mt-2 flex flex-col gap-1">
                  {slots.length === 0 && <span className="py-1 text-xs text-line">—</span>}
                  {slots.map((s) => {
                    const active = selected?.day.getTime() === d.getTime() && selected.time === s;
                    return (
                      <button
                        key={s}
                        onClick={() => setSelected({ day: d, time: s })}
                        className={`rounded-lg py-1.5 text-[11px] font-bold transition sm:text-xs ${
                          active ? "bg-brand-500 text-white shadow-md shadow-brand-500/30" : "bg-surface text-ink hover:bg-brand-50 hover:text-brand-700"
                        }`}
                      >
                        {s}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        <button disabled={!selected} onClick={() => setConfirmOpen(true)} className={`${btn.primary} mt-6 w-full !py-3.5`}>
          <CalendarCheck className="h-5 w-5" />
          {selected ? `Réserver le ${LONG_FMT.format(selected.day)} · ${selected.time}` : type === "essai" ? "Réserver mon cours gratuit" : "Réserver un cours"}
        </button>
        <Link href={`/messages?to=${teacher.id}`} className={`${btn.outline} mt-2 w-full`}>
          Envoyer un message
        </Link>

        <ul className="mt-5 space-y-2 text-sm text-muted">
          <li className="flex gap-2"><Video className="h-4 w-4 shrink-0 text-brand-500" /> Lien Google Meet créé automatiquement</li>
          <li className="flex gap-2"><Mail className="h-4 w-4 shrink-0 text-brand-500" /> Confirmation et rappel par e-mail</li>
          <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 shrink-0 text-brand-500" /> Pas satisfait ? 2e essai gratuit avec un autre enseignant</li>
        </ul>
      </div>

      {confirmOpen && selected && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-ink/60 p-4 backdrop-blur-sm" role="dialog" aria-modal="true">
          <div className="relative w-full max-w-md rounded-[2rem] bg-white p-7">
            <button onClick={() => setConfirmOpen(false)} className="absolute right-4 top-4 rounded-full p-1.5 hover:bg-surface" aria-label="Fermer">
              <X className="h-5 w-5" />
            </button>
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 text-white">
              <CalendarCheck className="h-6 w-6" />
            </span>
            <h2 className="mt-4 text-2xl font-extrabold">Encore une étape</h2>
            <dl className="mt-4 space-y-2 rounded-2xl bg-surface p-4 text-sm">
              <div className="flex justify-between gap-4"><dt className="text-muted">Enseignant</dt><dd className="font-bold">{teacher.name}</dd></div>
              <div className="flex justify-between gap-4"><dt className="text-muted">Type</dt><dd className="font-bold">{type === "essai" ? "Cours d'essai gratuit" : "Cours"} · {duration} min</dd></div>
              <div className="flex justify-between gap-4"><dt className="text-muted">Date</dt><dd className="font-bold capitalize">{LONG_FMT.format(selected.day)} · {selected.time}</dd></div>
            </dl>
            <p className="mt-4 text-sm text-muted">
              Créez votre compte en un clic pour confirmer. Le lien Google Meet vous sera envoyé par e-mail.
            </p>
            <Link href="/inscription" className={`${btn.outline} mt-5 w-full`}>
              <GoogleIcon /> Continuer avec Google
            </Link>
            <Link href="/inscription" className={`${btn.dark} mt-2 w-full`}>
              Continuer avec mon e-mail
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
