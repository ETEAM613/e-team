"use client";

import Link from "next/link";
import { useState } from "react";
import { CheckCircle2, Lock, Video, X, Zap } from "lucide-react";
import type { Teacher } from "@/lib/data";
import Avatar from "@/components/Avatar";
import { btn, chip } from "@/components/ui";

export default function SosBoard({ teachers }: { teachers: Teacher[] }) {
  const [calling, setCalling] = useState<Teacher | null>(null);

  const online = teachers.filter((t) => t.availableNow);

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-700">
          <span className="live-dot" /> {online.length} enseignant{online.length > 1 ? "s" : ""} disponible{online.length > 1 ? "s" : ""} maintenant
        </p>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {online.map((t) => (
          <article key={t.id} className="flex flex-col rounded-[2rem] border border-line bg-white p-6 text-center transition hover:border-rose-200 hover:shadow-xl hover:shadow-rose-500/10">
            <Avatar name={t.name} gradient={t.gradient} size={88} online className="mx-auto" />
            <h2 className="mt-4 text-xl font-extrabold">{t.name}</h2>
            <p className="text-sm text-muted">{t.title}</p>
            <div className="mt-3 flex flex-wrap justify-center gap-1.5">
              {t.subjects.map((s) => <span key={s} className={chip}>{s}</span>)}
            </div>
            <p className="mt-3 text-xs font-semibold text-emerald-700">Répond en moins de 2 minutes</p>
            <button
              onClick={() => setCalling(t)}
              className="mt-5 inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-rose-500 to-orange-500 px-6 py-3 font-bold text-white shadow-lg shadow-rose-500/30 transition hover:brightness-110"
            >
              <Zap className="h-5 w-5 fill-white" /> Lancer un SOS
            </button>
          </article>
        ))}
        {online.length === 0 && (
          <div className="rounded-[2rem] border-2 border-dashed border-line bg-white p-12 text-center sm:col-span-2 lg:col-span-3">
            <p className="text-lg font-bold">Aucun enseignant disponible à l&apos;instant pour ce profil.</p>
            <p className="mt-1 text-muted">Réessayez dans quelques minutes, ou réservez un créneau.</p>
            <Link href="/enseignants" className={`${btn.dark} mt-5`}>Réserver un créneau</Link>
          </div>
        )}
      </div>

      <div className="mt-10 grid gap-4 rounded-[2rem] bg-white p-7 ring-1 ring-line md:grid-cols-3">
        {[
          { t: "Choisissez", d: "Un enseignant marqué « Disponible maintenant »." },
          { t: "Connectez-vous", d: "Le lien Google Meet est créé et ouvert instantanément." },
          { t: "Étudiez", d: "Un échange en tête-à-tête, aussi long que nécessaire." },
        ].map((s, i) => (
          <div key={s.t} className="flex gap-4">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-rose-50 font-display font-extrabold text-rose-600">{i + 1}</span>
            <div>
              <p className="font-bold">{s.t}</p>
              <p className="text-sm text-muted">{s.d}</p>
            </div>
          </div>
        ))}
      </div>

      {calling && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-ink/60 p-4 backdrop-blur-sm" role="dialog" aria-modal="true">
          <div className="relative w-full max-w-md rounded-[2rem] bg-white p-7">
            <button onClick={() => setCalling(null)} className="absolute right-4 top-4 rounded-full p-1.5 hover:bg-surface" aria-label="Fermer">
              <X className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-4">
              <Avatar name={calling.name} gradient={calling.gradient} size={64} online />
              <div>
                <p className="text-sm font-bold text-rose-600">SOS avec</p>
                <p className="font-display text-xl font-extrabold">{calling.name}</p>
              </div>
            </div>
            <div className="mt-6 rounded-2xl bg-surface p-4">
              <p className="flex items-center gap-2 font-bold"><Lock className="h-4 w-4" /> Accès au SOS</p>
              <ul className="mt-3 space-y-2 text-sm text-muted">
                <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" /> Un compte e-team</li>
                <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" /> Votre choix de sponsoring effectué (sponsoriser ou être sponsorisé)</li>
                <li className="flex gap-2"><Video className="h-4 w-4 shrink-0 text-brand-500" /> Le lien Google Meet s&apos;ouvre aussitôt</li>
              </ul>
            </div>
            <Link href="/inscription" className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-rose-500 to-orange-500 px-6 py-3.5 font-bold text-white">
              Créer mon compte et lancer le SOS
            </Link>
            <Link href="/connexion" className={`${btn.outline} mt-2 w-full`}>J&apos;ai déjà un compte</Link>
          </div>
        </div>
      )}
    </>
  );
}
