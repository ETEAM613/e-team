"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { CalendarCheck, CheckCircle2, ChevronLeft, ChevronRight, Mail, Video, X } from "lucide-react";
import type { Teacher } from "@/lib/data";

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
    start.setHours(0, 0, 0, 0);
    start.setDate(start.getDate() + weekOffset * 7);
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return d;
    });
  }, [today, weekOffset]);

  const slotsFor = (d: Date) => {
    // Pas de cours le Chabbat (samedi)
    if (d.getDay() === 6) return [];
    const all = teacher.available.flatMap((m) => SLOTS[m]);
    // Le vendredi, uniquement le matin
    if (d.getDay() === 5) return all.filter((s) => s < "12:00");
    // Variation pseudo-aléatoire stable pour simuler des créneaux déjà pris
    return all.filter((_, i) => (d.getDate() + i) % 3 !== 0);
  };

  const price = type === "essai" ? teacher.trialPrice : teacher.price;
  const duration = type === "essai" ? 25 : 50;

  return (
    <div className="rounded-3xl border-2 border-ink bg-white p-5 shadow-[6px_6px_0_0_var(--color-ink)] sm:p-6">
      <div className="grid grid-cols-2 gap-1 rounded-xl bg-sand p-1">
        {(["essai", "cours"] as const).map((k) => (
          <button
            key={k}
            onClick={() => setType(k)}
            className={`rounded-lg px-3 py-2 text-sm font-bold transition ${type === k ? "bg-white text-ink shadow-sm" : "text-muted"}`}
          >
            {k === "essai" ? "Cours d'essai · 25 min" : "Cours · 50 min"}
          </button>
        ))}
      </div>

      <p className="mt-5 text-3xl font-extrabold">
        {price === 0 ? "Gratuit" : `${price} €`}
        <span className="ml-2 text-base font-medium text-muted">/ {duration} min</span>
      </p>

      <div className="mt-5 flex items-center justify-between">
        <p className="font-bold">Choisissez un créneau</p>
        <div className="flex gap-1">
          <button
            onClick={() => setWeekOffset((w) => Math.max(0, w - 1))}
            disabled={weekOffset === 0}
            className="grid h-8 w-8 place-items-center rounded-lg border border-line disabled:opacity-40"
            aria-label="Semaine précédente"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => setWeekOffset((w) => Math.min(3, w + 1))}
            className="grid h-8 w-8 place-items-center rounded-lg border border-line"
            aria-label="Semaine suivante"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
      <p className="mt-1 text-xs text-muted">Heure de Paris · aucun cours pendant Chabbat</p>

      <div className="mt-3 grid min-h-40 grid-cols-7 gap-1 text-center">
        {days.map((d) => {
          const slots = slotsFor(d);
          return (
            <div key={d.toISOString()} className="min-w-0">
              <p className="text-[11px] font-bold uppercase text-muted">{DAY_FMT.format(d).replace(".", "")}</p>
              <p className="text-sm font-extrabold">{DATE_FMT.format(d)}</p>
              <div className="mt-2 flex flex-col gap-1">
                {slots.length === 0 && <span className="py-1 text-xs text-line">—</span>}
                {slots.map((s) => {
                  const active = selected?.day.getTime() === d.getTime() && selected.time === s;
                  return (
                    <button
                      key={s}
                      onClick={() => setSelected({ day: d, time: s })}
                      className={`rounded-md py-1 text-[11px] font-bold transition sm:text-xs ${
                        active ? "bg-ink text-white" : "bg-navy-50 text-navy-700 hover:bg-navy-100"
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

      <button
        disabled={!selected}
        onClick={() => setConfirmOpen(true)}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gold-400 px-5 py-3.5 font-bold text-ink transition hover:bg-gold-300 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <CalendarCheck className="h-5 w-5" />
        {selected
          ? `Réserver le ${LONG_FMT.format(selected.day)} à ${selected.time}`
          : type === "essai"
            ? "Réserver un cours d'essai"
            : "Réserver un cours"}
      </button>
      <Link
        href={`/messages?to=${teacher.id}`}
        className="mt-2 block w-full rounded-xl border-2 border-line px-5 py-3 text-center font-bold transition hover:border-ink"
      >
        Envoyer un message
      </Link>

      <ul className="mt-5 space-y-2 text-sm text-muted">
        <li className="flex gap-2"><Video className="h-4 w-4 shrink-0" /> Lien Google Meet créé automatiquement</li>
        <li className="flex gap-2"><Mail className="h-4 w-4 shrink-0" /> Confirmation et rappel par e-mail</li>
        <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 shrink-0" /> Annulation gratuite jusqu&apos;à 12 h avant</li>
      </ul>

      {confirmOpen && selected && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-ink/60 p-4" role="dialog" aria-modal="true">
          <div className="relative w-full max-w-md rounded-3xl bg-white p-7">
            <button onClick={() => setConfirmOpen(false)} className="absolute right-4 top-4 rounded-lg p-1 hover:bg-sand" aria-label="Fermer">
              <X className="h-5 w-5" />
            </button>
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gold-400">
              <CalendarCheck className="h-6 w-6" />
            </span>
            <h2 className="mt-4 text-2xl font-extrabold">Confirmer votre réservation</h2>
            <dl className="mt-4 space-y-2 rounded-2xl bg-sand p-4 text-sm">
              <div className="flex justify-between"><dt className="text-muted">Enseignant</dt><dd className="font-bold">{teacher.name}</dd></div>
              <div className="flex justify-between"><dt className="text-muted">Type</dt><dd className="font-bold">{type === "essai" ? "Cours d'essai" : "Cours"} · {duration} min</dd></div>
              <div className="flex justify-between"><dt className="text-muted">Date</dt><dd className="font-bold capitalize">{LONG_FMT.format(selected.day)} · {selected.time}</dd></div>
              <div className="flex justify-between"><dt className="text-muted">Prix</dt><dd className="font-bold">{price === 0 ? "Gratuit" : `${price} €`}</dd></div>
            </dl>
            <p className="mt-4 text-sm text-muted">
              Pour réserver, connectez-vous ou créez votre compte élève. Le lien Google Meet vous sera ensuite envoyé par e-mail.
            </p>
            <Link href="/inscription" className="mt-5 block rounded-xl bg-ink px-5 py-3.5 text-center font-bold text-white hover:bg-navy-700">
              Continuer
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
