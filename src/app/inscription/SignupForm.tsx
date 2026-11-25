"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { BookOpen, GraduationCap, Users } from "lucide-react";
import { signup } from "@/app/actions/auth";
import type { Gender } from "@/lib/data";
import FormError from "@/components/FormError";
import { btn, input } from "@/components/ui";

type Role = "eleve" | "parent" | "enseignant";

const ROLES: { value: Role; label: string; icon: typeof BookOpen; desc: string }[] = [
  { value: "eleve", label: "Élève", icon: BookOpen, desc: "J'étudie" },
  { value: "parent", label: "Parent", icon: Users, desc: "Pour mes enfants" },
  { value: "enseignant", label: "Enseignant", icon: GraduationCap, desc: "J'enseigne" },
];

export default function SignupForm({ initialRole, initialGender }: { initialRole: Role; initialGender: Gender | null }) {
  const [role, setRole] = useState<Role>(initialRole);
  const [state, action, pending] = useActionState(signup, undefined);

  return (
    <div className="w-full max-w-lg rounded-[2rem] border border-line bg-white p-7 shadow-2xl shadow-brand-500/10 sm:p-9">
      <h1 className="text-3xl font-extrabold">Créer mon compte</h1>
      <p className="mt-2 text-muted">Gratuit, en moins d&apos;une minute. Votre premier cours est offert.</p>

      <div className="mt-6 grid grid-cols-3 gap-2" role="radiogroup" aria-label="Type de compte">
        {ROLES.map(({ value, label, icon: Icon, desc }) => (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={role === value}
            onClick={() => setRole(value)}
            className={`rounded-2xl border-2 p-3 text-center transition ${
              role === value ? "border-brand-500 bg-brand-50 text-brand-700" : "border-line hover:border-brand-300"
            }`}
          >
            <Icon className="mx-auto h-6 w-6" />
            <span className="mt-1 block text-sm font-extrabold">{label}</span>
            <span className="block text-[11px] text-muted">{desc}</span>
          </button>
        ))}
      </div>

      <form action={action} className="mt-6 space-y-4">
        <input type="hidden" name="role" value={role} />
        <fieldset>
          <legend className="mb-1.5 block text-sm font-bold">Je suis</legend>
          <div className="grid grid-cols-2 gap-2">
            {([
              ["homme", "Un homme"],
              ["femme", "Une femme"],
            ] as const).map(([value, label]) => (
              <label
                key={value}
                className="flex cursor-pointer items-center gap-2 rounded-2xl border-2 border-line px-4 py-3 font-semibold has-[:checked]:border-brand-500 has-[:checked]:bg-brand-50"
              >
                <input
                  type="radio"
                  name="gender"
                  value={value}
                  required
                  defaultChecked={initialGender === value}
                  className="accent-[var(--color-brand-500)]"
                />
                {label}
              </label>
            ))}
          </div>
          {role === "parent" && <p className="mt-1.5 text-xs text-muted">Vous ajouterez ensuite vos enfants depuis votre compte.</p>}
        </fieldset>

        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <span className="mb-1.5 block text-sm font-bold">Prénom</span>
            <input name="firstName" required autoComplete="given-name" defaultValue={state?.fields?.firstName} className={input} />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-bold">Nom</span>
            <input name="lastName" required autoComplete="family-name" defaultValue={state?.fields?.lastName} className={input} />
          </label>
        </div>

        <label className="block">
          <span className="mb-1.5 block text-sm font-bold">E-mail</span>
          <input
            type="email"
            name="email"
            required
            autoComplete="email"
            defaultValue={state?.fields?.email}
            className={input}
            placeholder="vous@exemple.com"
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-bold">Mot de passe</span>
          <input type="password" name="password" required minLength={8} autoComplete="new-password" className={input} />
          <span className="mt-1 block text-xs text-muted">8 caractères minimum</span>
        </label>

        {role === "enseignant" && (
          <fieldset className="rounded-2xl bg-rose-50/60 p-4 ring-1 ring-rose-100">
            <legend className="sr-only">SOS</legend>
            <p className="text-sm font-bold">Voulez-vous recevoir les demandes SOS ?</p>
            <p className="mt-0.5 text-xs text-muted">
              Quand un élève a une question urgente, tous les enseignants SOS reçoivent une alerte par e-mail. Le premier disponible répond. Modifiable à tout moment dans votre espace.
            </p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {([["oui", "Oui, je participe"], ["non", "Non merci"]] as const).map(([v, l]) => (
                <label key={v} className="flex cursor-pointer items-center gap-2 rounded-xl border-2 border-line bg-white px-3 py-2.5 text-sm font-semibold has-[:checked]:border-rose-400 has-[:checked]:bg-rose-50">
                  <input type="radio" name="sos" value={v} required className="accent-rose-500" /> {l}
                </label>
              ))}
            </div>
          </fieldset>
        )}

        <label className="flex items-start gap-2 text-sm">
          <input type="checkbox" name="terms" required className="mt-1 accent-[var(--color-brand-500)]" />
          <span>J&apos;accepte les conditions d&apos;utilisation et la politique de confidentialité.</span>
        </label>

        <FormError state={state} />

        <button disabled={pending} className={`${btn.primary} w-full !py-3.5`}>
          {pending ? "Création du compte…" : role === "enseignant" ? "Créer mon compte enseignant" : "Créer mon compte"}
        </button>
        {role === "enseignant" && (
          <p className="text-center text-xs text-muted">Vous compléterez ensuite votre profil, vérifié par l&apos;équipe avant sa mise en ligne.</p>
        )}
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        Déjà inscrit ?{" "}
        <Link href="/connexion" className="font-bold text-brand-600 hover:underline">Connexion</Link>
      </p>
    </div>
  );
}
