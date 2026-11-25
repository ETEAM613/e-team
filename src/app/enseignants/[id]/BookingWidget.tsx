"use client";

import Link from "next/link";
import { useActionState, useMemo, useState, useSyncExternalStore } from "react";
import { CalendarCheck, ChevronLeft, ChevronRight, Clock, Mail, MessageCircle, Video } from "lucide-react";
import { bookLesson } from "@/app/actions/lessons";
import FormError from "@/components/FormError";
import { btn, input } from "@/components/ui";
import { BANDS } from "@/lib/time";

type Props = {
  teacherSlug: string;
  teacherName: string;
  subjects: string[];
  slots: { 30: string[]; 60: string[] };
  loggedIn: boolean;
  canBookSelf: boolean;
  kids: { id: string; name: string }[];
  isDemo: boolean;
};

const subscribeNoop = () => () => {};
const DAY_KEY = new Intl.DateTimeFormat("fr-CA", { year: "numeric", month: "2-digit", day: "2-digit" }); // AAAA-MM-JJ local
const WEEKDAY = new Intl.DateTimeFormat("fr-FR", { weekday: "short" });
const DAYNUM = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "short" });
const LONG = new Intl.DateTimeFormat("fr-FR", { weekday: "long", day: "numeric", month: "long" });
const TIME = new Intl.DateTimeFormat("fr-FR", { hour: "2-digit", minute: "2-digit" });

export default function BookingWidget(p: Props) {
  // Les créneaux sont affichés dans le fuseau du navigateur : on attend d'être côté navigateur.
  const mounted = useSyncExternalStore(subscribeNoop, () => true, () => false);
  const [duration, setDuration] = useState<30 | 60>(60);
  const [page, setPage] = useState(0);
  const [day, setDay] = useState<string | null>(null);
  const [start, setStart] = useState<string | null>(null);
  const [state, action, pending] = useActionState(bookLesson, undefined);

  const byDay = useMemo(() => {
    const map = new Map<string, string[]>();
    if (!mounted) return map;
    for (const iso of p.slots[duration]) {
      const k = DAY_KEY.format(new Date(iso));
      map.set(k, [...(map.get(k) ?? []), iso]);
    }
    return map;
  }, [mounted, p.slots, duration]);

  const days = [...byDay.keys()];
  const visible = days.slice(page * 7, page * 7 + 7);
  const selectedDay = day && byDay.has(day) ? day : (visible[0] ?? null);
  const daySlots = selectedDay ? (byDay.get(selectedDay) ?? []) : [];
  const tz = mounted ? Intl.DateTimeFormat().resolvedOptions().timeZone : "";
  const forWhoOptions = [...(p.canBookSelf ? [{ id: "", name: "Moi" }] : []), ...p.kids];

  if (p.isDemo) {
    return (
      <Shell>
        <p className="text-muted">Ce profil est une démonstration : la réservation n&apos;est pas disponible. Les vrais enseignants arrivent bientôt !</p>
      </Shell>
    );
  }

  if (p.loggedIn && forWhoOptions.length === 0) {
    return (
      <Shell>
        <p className="text-muted">Cet enseignant donne des cours aux enfants. Ajoutez votre enfant dans votre compte pour réserver.</p>
        <Link href="/mon-compte#enfants" className={`${btn.dark} mt-4 w-full`}>Ajouter un enfant</Link>
      </Shell>
    );
  }

  return (
    <Shell>
      {/* Durée */}
      <p className="text-sm font-bold">Durée du cours</p>
      <div className="mt-2 grid grid-cols-2 gap-1 rounded-full bg-surface p-1">
        {([30, 60] as const).map((d) => (
          <button
            key={d}
            type="button"
            onClick={() => {
              setDuration(d);
              setStart(null);
            }}
            className={`rounded-full py-2 text-sm font-bold transition ${duration === d ? "bg-white text-ink shadow-sm" : "text-muted"}`}
          >
            {d === 30 ? "30 min" : "1 heure"}
          </button>
        ))}
      </div>

      {/* Jours */}
      <div className="mt-5 flex items-center justify-between">
        <p className="text-sm font-bold">Choisissez un jour</p>
        <div className="flex gap-1">
          <button type="button" disabled={page === 0} onClick={() => setPage((x) => x - 1)} className="grid h-8 w-8 place-items-center rounded-full border border-line disabled:opacity-30" aria-label="Jours précédents">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button type="button" disabled={(page + 1) * 7 >= days.length} onClick={() => setPage((x) => x + 1)} className="grid h-8 w-8 place-items-center rounded-full border border-line disabled:opacity-30" aria-label="Jours suivants">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {!mounted ? (
        <div className="mt-3 h-32 animate-pulse rounded-2xl bg-surface" />
      ) : days.length === 0 ? (
        <p className="mt-3 rounded-2xl bg-surface p-4 text-sm text-muted">
          Aucun créneau libre dans les 3 prochaines semaines. Écrivez à l&apos;enseignant pour convenir d&apos;un horaire.
        </p>
      ) : (
        <>
          <div className="mt-3 grid grid-cols-4 gap-1.5 sm:grid-cols-7">
            {visible.map((k) => {
              const d = new Date(byDay.get(k)![0]);
              const active = k === selectedDay;
              return (
                <button
                  key={k}
                  type="button"
                  onClick={() => {
                    setDay(k);
                    setStart(null);
                  }}
                  className={`rounded-xl px-1 py-2 text-center transition ${active ? "bg-brand-500 text-white" : "bg-surface hover:bg-brand-50"}`}
                >
                  <span className="block text-[11px] font-bold uppercase opacity-80">{WEEKDAY.format(d).replace(".", "")}</span>
                  <span className="block text-sm font-extrabold">{DAYNUM.format(d).replace(".", "")}</span>
                  <span className={`block text-[10px] ${active ? "text-white/80" : "text-muted"}`}>{byDay.get(k)!.length} créneaux</span>
                </button>
              );
            })}
          </div>

          {/* Heures, par tranche */}
          <div className="mt-4 space-y-3">
            {BANDS.map((b) => {
              const list = daySlots.filter((iso) => {
                const h = new Date(iso).getHours();
                return h >= b.from && h < b.to;
              });
              if (!list.length) return null;
              return (
                <div key={b.key}>
                  <p className="mb-1.5 text-xs font-bold uppercase tracking-wider text-muted">{b.label}</p>
                  <div className="grid grid-cols-4 gap-1.5">
                    {list.map((iso) => (
                      <button
                        key={iso}
                        type="button"
                        onClick={() => setStart(iso)}
                        className={`rounded-lg py-2 text-sm font-bold transition ${
                          start === iso ? "bg-brand-500 text-white shadow-md shadow-brand-500/30" : "bg-surface hover:bg-brand-50 hover:text-brand-700"
                        }`}
                      >
                        {TIME.format(new Date(iso))}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
          <p className="mt-2 text-[11px] text-muted">Heures affichées dans votre fuseau ({tz}).</p>
        </>
      )}

      {/* Réservation */}
      <form action={action} className="mt-5 space-y-3 border-t border-line pt-5">
        <input type="hidden" name="teacher" value={p.teacherSlug} />
        <input type="hidden" name="duration" value={duration} />
        <input type="hidden" name="start" value={start ?? ""} />
        <input type="hidden" name="tz" value={tz} />
        <div className="grid grid-cols-2 gap-2">
          <label className="block">
            <span className="mb-1 block text-xs font-bold text-muted">Sujet (facultatif)</span>
            <select name="subject" defaultValue="" className={`${input} !py-2 text-sm`}>
              <option value="">Au choix</option>
              {p.subjects.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </label>
          {p.loggedIn && forWhoOptions.length > 1 ? (
            <label className="block">
              <span className="mb-1 block text-xs font-bold text-muted">Pour</span>
              <select name="child" defaultValue={forWhoOptions[0].id} className={`${input} !py-2 text-sm`}>
                {forWhoOptions.map((o) => (
                  <option key={o.id || "moi"} value={o.id}>{o.name}</option>
                ))}
              </select>
            </label>
          ) : (
            <input type="hidden" name="child" value={forWhoOptions[0]?.id ?? ""} />
          )}
        </div>

        {start && (
          <p className="flex items-center gap-2 rounded-2xl bg-brand-50 p-3 text-sm font-semibold text-brand-700">
            <Clock className="h-4 w-4 shrink-0" />
            <span className="first-letter:uppercase">{LONG.format(new Date(start))}</span> à {TIME.format(new Date(start))} · {duration === 30 ? "30 min" : "1 h"}
          </p>
        )}
        <FormError state={state} />
        {p.loggedIn ? (
          <button disabled={!start || pending} className={`${btn.primary} w-full !py-3.5`}>
            <CalendarCheck className="h-5 w-5" /> {pending ? "Réservation…" : start ? "Réserver le cours" : "Choisissez un horaire"}
          </button>
        ) : (
          <Link href={`/connexion?suite=${encodeURIComponent(`/enseignants/${p.teacherSlug}#reserver`)}`} className={`${btn.primary} w-full !py-3.5`}>
            <CalendarCheck className="h-5 w-5" /> Se connecter pour réserver
          </Link>
        )}
      </form>

      <Link href={`/messages?to=${p.teacherSlug}`} className={`${btn.outline} mt-2 w-full`}>
        <MessageCircle className="h-4 w-4" /> Envoyer un message
      </Link>
      <ul className="mt-4 space-y-1.5 text-xs text-muted">
        <li className="flex gap-2"><Video className="h-4 w-4 shrink-0 text-brand-500" /> Le cours se déroule en vidéo directement sur e-team</li>
        <li className="flex gap-2"><Mail className="h-4 w-4 shrink-0 text-brand-500" /> Confirmation par e-mail à vous et à {p.teacherName.split(" ")[0]}</li>
      </ul>
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-[2rem] border border-line bg-white shadow-xl shadow-brand-500/10">
      <div className="bg-gradient-to-br from-brand-500 to-indigo-700 px-6 py-5 text-white">
        <p className="font-display text-2xl font-extrabold">Réserver un cours</p>
        <p className="text-sm text-white/80">Votre premier cours est offert</p>
      </div>
      <div className="p-5 sm:p-6">{children}</div>
    </div>
  );
}
