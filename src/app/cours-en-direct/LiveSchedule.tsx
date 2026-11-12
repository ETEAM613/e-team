"use client";

import Link from "next/link";
import { useMemo, useState, useSyncExternalStore } from "react";
import { CalendarPlus, Clock, ShieldCheck, Users } from "lucide-react";
import { getTeacher, LIVE_SESSIONS } from "@/lib/data";
import { useAudience } from "@/lib/audience";
import AudiencePicker, { AudienceSwitch } from "@/components/AudiencePicker";
import Avatar from "@/components/Avatar";
import { btn, chip } from "@/components/ui";

const DAY_FMT = new Intl.DateTimeFormat("fr-FR", { weekday: "long", day: "numeric", month: "long" });
const SHORT_FMT = new Intl.DateTimeFormat("fr-FR", { weekday: "short", day: "numeric" });

const subscribeNoop = () => () => {};
const startOfToday = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.getTime();
};

export default function LiveSchedule() {
  const audience = useAudience();
  const today = useSyncExternalStore(subscribeNoop, startOfToday, () => null);
  const [day, setDay] = useState<number | "all">("all");

  const days = useMemo(() => {
    if (today === null) return [];
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(today);
      d.setDate(d.getDate() + i);
      return d;
    });
  }, [today]);

  if (!audience) return <AudiencePicker title="Quels cours vous intéressent ?" />;

  const sessions = LIVE_SESSIONS.filter((s) => s.audience.includes(audience))
    .filter((s) => day === "all" || s.dayOffset === day)
    .sort((a, b) => a.dayOffset - b.dayOffset || a.time.localeCompare(b.time));

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <AudienceSwitch />
        <p className="flex items-center gap-1.5 text-sm text-muted">
          <ShieldCheck className="h-4 w-4 text-teal-600" /> Chaque cours est validé par l&apos;équipe avant publication
        </p>
      </div>

      <div className="mt-6 flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none]">
        <button
          onClick={() => setDay("all")}
          className={`shrink-0 rounded-2xl px-4 py-3 text-sm font-bold transition ${day === "all" ? "bg-ink text-white" : "bg-white ring-1 ring-line hover:ring-ink"}`}
        >
          7 prochains jours
        </button>
        {days.map((d, i) => (
          <button
            key={i}
            onClick={() => setDay(i)}
            className={`shrink-0 rounded-2xl px-4 py-3 text-sm font-bold capitalize transition ${day === i ? "bg-teal-500 text-white" : "bg-white ring-1 ring-line hover:ring-ink"}`}
          >
            {i === 0 ? "Aujourd'hui" : SHORT_FMT.format(d)}
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {sessions.map((s) => {
          const t = getTeacher(s.teacherId)!;
          const date = days[s.dayOffset];
          const pct = Math.round((s.enrolled / s.capacity) * 100);
          return (
            <article key={s.id} className="flex flex-col rounded-[2rem] border border-line bg-white p-6 transition hover:border-teal-300 hover:shadow-xl hover:shadow-teal-500/10">
              <div className="flex items-center justify-between gap-3">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-3 py-1 text-xs font-bold capitalize text-teal-700">
                  {s.dayOffset === 0 && <span className="live-dot !h-1.5 !w-1.5" />}
                  {s.dayOffset === 0 ? "Aujourd'hui" : date ? DAY_FMT.format(date) : ""}
                </span>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">Gratuit</span>
              </div>
              <h2 className="mt-4 text-2xl font-extrabold">{s.title}</h2>
              <div className="mt-2 flex flex-wrap gap-2 text-sm text-muted">
                <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> {s.time} · {s.duration} min</span>
                <span className={chip}>{s.subject}</span>
              </div>
              <div className="mt-5 flex items-center gap-3">
                <Avatar name={t.name} gradient={t.gradient} size={44} />
                <div>
                  <p className="font-bold">{t.name}</p>
                  <p className="text-xs text-muted">{t.title}</p>
                </div>
              </div>
              <div className="mt-5">
                <div className="flex justify-between text-xs font-semibold text-muted">
                  <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {s.enrolled} inscrits</span>
                  <span>{s.capacity - s.enrolled} places restantes</span>
                </div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-surface">
                  <div className="h-full rounded-full bg-gradient-to-r from-teal-400 to-sky-500" style={{ width: `${pct}%` }} />
                </div>
              </div>
              <Link href="/inscription" className={`${btn.dark} mt-6`}>
                <CalendarPlus className="h-5 w-5" /> M&apos;inscrire gratuitement
              </Link>
            </article>
          );
        })}
        {sessions.length === 0 && (
          <div className="rounded-[2rem] border-2 border-dashed border-line bg-white p-12 text-center md:col-span-2">
            <p className="text-lg font-bold">Aucun cours en direct ce jour-là pour ce profil.</p>
            <button onClick={() => setDay("all")} className="mt-3 font-bold text-teal-700 hover:underline">Voir toute la semaine</button>
          </div>
        )}
      </div>
    </>
  );
}
