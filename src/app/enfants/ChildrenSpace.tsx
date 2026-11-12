"use client";

import Link from "next/link";
import { BookOpen, ClipboardList, ShieldCheck, UserPlus } from "lucide-react";
import { teachersFor } from "@/lib/data";
import { setAudience, useAudience } from "@/lib/audience";
import TeacherCard from "@/components/TeacherCard";
import { btn } from "@/components/ui";

const CHILDREN = [
  { value: "garcon" as const, label: "Mon fils", desc: "Enseignants acceptant les garçons", tone: "from-sky-500 to-blue-600" },
  { value: "fille" as const, label: "Ma fille", desc: "Enseignantes acceptant les filles", tone: "from-pink-500 to-rose-500" },
];

export default function ChildrenSpace() {
  const audience = useAudience();
  const child = audience === "garcon" || audience === "fille" ? audience : null;
  const teachers = teachersFor(child);

  return (
    <>
      <div className="grid gap-4 md:grid-cols-3">
        {[
          { icon: UserPlus, t: "Sous-comptes enfants", d: "Ajoutez chaque enfant depuis votre compte parent, avec son âge et son niveau." },
          { icon: ShieldCheck, t: "Enseignant adapté", d: "Seuls les enseignants qui acceptent le genre de votre enfant vous sont proposés." },
          { icon: ClipboardList, t: "Suivi pour les parents", d: "Un petit bilan après chaque cours, et l'historique de progression." },
        ].map(({ icon: Icon, t, d }) => (
          <div key={t} className="rounded-[2rem] border border-line bg-white p-6">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-amber-100 text-amber-700">
              <Icon className="h-6 w-6" />
            </span>
            <p className="mt-4 text-lg font-extrabold">{t}</p>
            <p className="mt-1 text-sm text-muted">{d}</p>
          </div>
        ))}
      </div>

      <h2 className="mt-14 text-3xl font-extrabold">Je cherche un cours pour…</h2>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {CHILDREN.map((c) => (
          <button
            key={c.value}
            onClick={() => setAudience(c.value)}
            className={`flex items-center gap-4 rounded-[1.5rem] border-2 p-5 text-left transition ${
              child === c.value ? "border-brand-500 bg-brand-50" : "border-line bg-white hover:border-brand-300"
            }`}
          >
            <span className={`grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br text-white ${c.tone}`}>
              <BookOpen className="h-7 w-7" />
            </span>
            <span>
              <span className="block text-xl font-extrabold">{c.label}</span>
              <span className="block text-sm text-muted">{c.desc}</span>
            </span>
          </button>
        ))}
      </div>

      {child && (
        <div className="mt-8 space-y-4">
          {teachers.map((t) => <TeacherCard key={t.id} teacher={t} />)}
        </div>
      )}

      <div className="mt-12 flex flex-col items-start gap-4 rounded-[2rem] bg-ink p-8 text-white sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-2xl font-extrabold">Créez votre compte parent</p>
          <p className="mt-1 text-white/70">Puis ajoutez vos enfants en quelques secondes.</p>
        </div>
        <Link href="/inscription" className={btn.light}>Créer mon compte parent</Link>
      </div>
    </>
  );
}
