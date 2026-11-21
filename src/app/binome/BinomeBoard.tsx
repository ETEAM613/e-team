"use client";

import Link from "next/link";
import { useState } from "react";
import { BadgeCheck, Clock, MapPin, MessageCircle, Plus } from "lucide-react";
import { BINOME_REQUESTS, MOMENTS, SUBJECTS } from "@/lib/data";
import { useGender } from "@/lib/profile";
import DemoForm from "@/components/DemoForm";
import { btn, chip, input } from "@/components/ui";

const momentLabel = (m: string) => MOMENTS.find((x) => x.value === m)?.label ?? m;

export default function BinomeBoard() {
  const gender = useGender();
  const [subject, setSubject] = useState("");
  const [showForm, setShowForm] = useState(false);

  const list = BINOME_REQUESTS.filter((r) => (!gender || r.audience === gender) && (!subject || r.subject === subject));

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted">Gratuit · réservé aux comptes vérifiés</p>
        <button onClick={() => setShowForm((v) => !v)} className={`${btn.primary} !bg-emerald-500 !shadow-emerald-500/25 hover:!bg-emerald-600`}>
          <Plus className="h-5 w-5" /> Publier ma demande
        </button>
      </div>

      {showForm && (
        <DemoForm className="mt-6 rounded-[2rem] border border-emerald-200 bg-white p-6 sm:p-8">
          <h2 className="text-2xl font-extrabold">Ma demande de binôme</h2>
          <p className="mt-1 text-sm text-muted">Visible uniquement par les membres vérifiés de votre espace.</p>
          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            <label className="block">
              <span className="mb-1.5 block text-sm font-bold">Matière</span>
              <select required className={input} defaultValue="">
                <option value="" disabled>Choisir…</option>
                {SUBJECTS.map((s) => <option key={s}>{s}</option>)}
              </select>
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-bold">Niveau</span>
              <select required className={input} defaultValue="">
                <option value="" disabled>Choisir…</option>
                <option>Débutant</option>
                <option>Intermédiaire</option>
                <option>Avancé</option>
              </select>
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-bold">Moment préféré</span>
              <select required className={input} defaultValue="">
                <option value="" disabled>Choisir…</option>
                {MOMENTS.map((m) => <option key={m.value}>{m.label}</option>)}
              </select>
            </label>
          </div>
          <label className="mt-4 block">
            <span className="mb-1.5 block text-sm font-bold">Ce que je cherche</span>
            <textarea required rows={3} className={input} placeholder="Ex. : avancer dans Berakhot, 3 soirs par semaine, 30 minutes." />
          </label>
          <button className={`${btn.dark} mt-5`}>Publier</button>
        </DemoForm>
      )}

      <div className="mt-6 flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none]">
        {["", "Guemara", "Michna", "Halakha", "Paracha", "Tanakh", "Moussar"].map((s) => (
          <button
            key={s || "all"}
            onClick={() => setSubject(s)}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold transition ${
              subject === s ? "bg-emerald-500 text-white" : "bg-white ring-1 ring-line hover:ring-ink"
            }`}
          >
            {s || "Toutes les matières"}
          </button>
        ))}
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {list.map((r) => (
          <article key={r.id} className="flex flex-col rounded-[2rem] border border-line bg-white p-6 transition hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-500/10">
            <div className="flex items-center gap-3">
              <span className={`grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br font-display text-lg font-extrabold text-white ${r.gradient}`}>
                {r.initials}
              </span>
              <div>
                <p className="flex items-center gap-1.5 font-bold">
                  {r.firstName} <BadgeCheck className="h-4 w-4 text-emerald-500" aria-label="Compte vérifié" />
                </p>
                <p className="flex items-center gap-1 text-xs text-muted"><MapPin className="h-3 w-3" /> {r.city}</p>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-1.5">
              <span className={chip}>{r.subject}</span>
              <span className="rounded-full bg-surface px-2.5 py-1 text-xs font-semibold">{r.level}</span>
              {r.moments.map((m) => (
                <span key={m} className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                  <Clock className="h-3 w-3" /> {momentLabel(m)}
                </span>
              ))}
            </div>
            <p className="mt-4 flex-1 leading-relaxed">« {r.text} »</p>
            <Link href="/inscription" className={`${btn.outline} mt-5`}>
              <MessageCircle className="h-4 w-4" /> Proposer d&apos;étudier ensemble
            </Link>
          </article>
        ))}
        {list.length === 0 && (
          <p className="rounded-[2rem] border-2 border-dashed border-line bg-white p-10 text-center font-bold md:col-span-2 lg:col-span-3">
            Pas encore de demande pour cette matière. Publiez la vôtre !
          </p>
        )}
      </div>
    </>
  );
}
