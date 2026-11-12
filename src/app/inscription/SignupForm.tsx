"use client";

import Link from "next/link";
import { useState } from "react";
import { BookOpen, GraduationCap, Users } from "lucide-react";
import DemoForm, { inputCls } from "@/components/DemoForm";
import { SUBJECTS } from "@/lib/data";

type Role = "eleve" | "parent" | "enseignant";

const ROLES: { value: Role; label: string; icon: typeof BookOpen; desc: string }[] = [
  { value: "eleve", label: "Élève", icon: BookOpen, desc: "J'étudie pour moi" },
  { value: "parent", label: "Parent", icon: Users, desc: "Pour mon enfant" },
  { value: "enseignant", label: "Enseignant", icon: GraduationCap, desc: "J'enseigne" },
];

export default function SignupForm({ initialRole }: { initialRole: Role }) {
  const [role, setRole] = useState<Role>(initialRole);

  return (
    <div className="w-full max-w-lg rounded-3xl border-2 border-ink bg-white p-7 shadow-[6px_6px_0_0_var(--color-ink)] sm:p-9">
      <h1 className="text-3xl font-extrabold">Créer mon compte</h1>
      <p className="mt-2 text-muted">Gratuit, en une minute.</p>

      <div className="mt-6 grid grid-cols-3 gap-2" role="radiogroup" aria-label="Type de compte">
        {ROLES.map(({ value, label, icon: Icon, desc }) => (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={role === value}
            onClick={() => setRole(value)}
            className={`rounded-2xl border-2 p-3 text-center transition ${
              role === value ? "border-ink bg-gold-100" : "border-line hover:border-ink"
            }`}
          >
            <Icon className="mx-auto h-6 w-6" />
            <span className="mt-1 block text-sm font-extrabold">{label}</span>
            <span className="block text-[11px] text-muted">{desc}</span>
          </button>
        ))}
      </div>

      <DemoForm className="mt-6 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-sm font-bold">Prénom</span>
            <input required autoComplete="given-name" className={inputCls} />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-bold">Nom</span>
            <input required autoComplete="family-name" className={inputCls} />
          </label>
        </div>

        <fieldset>
          <legend className="mb-1.5 block text-sm font-bold">
            {role === "parent" ? "Mon enfant est" : "Je suis"}
          </legend>
          <div className="grid grid-cols-2 gap-2">
            {(role === "parent" ? ["Un garçon", "Une fille"] : ["Un homme", "Une femme"]).map((g) => (
              <label key={g} className="flex cursor-pointer items-center gap-2 rounded-xl border-2 border-line px-4 py-3 font-semibold has-[:checked]:border-ink has-[:checked]:bg-navy-50">
                <input type="radio" name="genre" required className="accent-[var(--color-ink)]" /> {g}
              </label>
            ))}
          </div>
          <p className="mt-1.5 text-xs text-muted">Pour vous orienter vers l&apos;espace qui vous correspond.</p>
        </fieldset>

        {role === "parent" && (
          <label className="block">
            <span className="mb-1.5 block text-sm font-bold">Âge de l&apos;enfant</span>
            <input type="number" min={4} max={17} required className={inputCls} />
          </label>
        )}

        {role === "enseignant" && (
          <label className="block">
            <span className="mb-1.5 block text-sm font-bold">Matière principale</span>
            <select required className={inputCls} defaultValue="">
              <option value="" disabled>Choisir…</option>
              {SUBJECTS.map((s) => <option key={s}>{s}</option>)}
            </select>
          </label>
        )}

        <label className="block">
          <span className="mb-1.5 block text-sm font-bold">E-mail</span>
          <input type="email" required autoComplete="email" className={inputCls} placeholder="vous@exemple.com" />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-bold">Mot de passe</span>
          <input type="password" required minLength={8} autoComplete="new-password" className={inputCls} />
          <span className="mt-1 block text-xs text-muted">8 caractères minimum</span>
        </label>

        <label className="flex items-start gap-2 text-sm">
          <input type="checkbox" required className="mt-1 accent-[var(--color-ink)]" />
          <span>J&apos;accepte les conditions d&apos;utilisation et la politique de confidentialité.</span>
        </label>

        <button className="w-full rounded-xl bg-gold-400 px-5 py-3.5 font-bold text-ink hover:bg-gold-300">
          {role === "enseignant" ? "Créer mon profil enseignant" : "Créer mon compte"}
        </button>
      </DemoForm>

      <p className="mt-6 text-center text-sm text-muted">
        Déjà inscrit ?{" "}
        <Link href="/connexion" className="font-bold text-ink underline-offset-4 hover:underline">Connexion</Link>
      </p>
    </div>
  );
}
