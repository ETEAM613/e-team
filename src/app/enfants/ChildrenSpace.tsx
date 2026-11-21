"use client";

import Link from "next/link";
import { useState } from "react";
import { ClipboardList, ShieldCheck, UserPlus } from "lucide-react";
import { kidsTeachers } from "@/lib/data";
import TeacherCard from "@/components/TeacherCard";
import { btn } from "@/components/ui";

const FILTERS = [
  { value: null, label: "Tous" },
  { value: "garcon" as const, label: "Garçons" },
  { value: "fille" as const, label: "Filles" },
];

export default function ChildrenSpace() {
  const [child, setChild] = useState<"garcon" | "fille" | null>(null);
  const teachers = kidsTeachers(child);

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

      <div className="mt-14 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-3xl font-extrabold">Nos enseignants pour les enfants</h2>
        <div className="flex gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.label}
              onClick={() => setChild(f.value)}
              className={`rounded-full px-4 py-2 text-sm font-bold transition ${
                child === f.value ? "bg-ink text-white" : "bg-white ring-1 ring-line hover:ring-ink"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-6 space-y-4">
        {teachers.map((t) => <TeacherCard key={t.id} teacher={t} />)}
      </div>

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
