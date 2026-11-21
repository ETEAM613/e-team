"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { BookOpen, GraduationCap, Users } from "lucide-react";
import GoogleIcon from "@/components/GoogleIcon";
import { SUBJECTS, type Gender } from "@/lib/data";
import { setGender } from "@/lib/profile";
import { btn, input } from "@/components/ui";

type Role = "eleve" | "parent" | "enseignant";

const ROLES: { value: Role; label: string; icon: typeof BookOpen; desc: string }[] = [
  { value: "eleve", label: "Élève", icon: BookOpen, desc: "J'étudie" },
  { value: "parent", label: "Parent", icon: Users, desc: "Pour mes enfants" },
  { value: "enseignant", label: "Enseignant", icon: GraduationCap, desc: "J'enseigne" },
];

export default function SignupForm({ initialRole, initialGender }: { initialRole: Role; initialGender: Gender | null }) {
  const router = useRouter();
  const [role, setRole] = useState<Role>(initialRole);
  const [gender, setG] = useState<Gender | null>(initialGender);

  // Aperçu : le compte n'est pas encore enregistré (étape 2), mais le genre
  // choisi adapte déjà tout le site (enseignants, cours en direct, SOS, binômes).
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gender) return;
    setGender(gender);
    router.push("/enseignants");
  };

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

      <form onSubmit={submit} className="mt-6 space-y-4">
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
                  name="genre"
                  required
                  checked={gender === value}
                  onChange={() => setG(value)}
                  className="accent-[var(--color-brand-500)]"
                />
                {label}
              </label>
            ))}
          </div>
          {role === "parent" && <p className="mt-1.5 text-xs text-muted">Vous indiquerez le genre de chaque enfant en l&apos;ajoutant.</p>}
        </fieldset>

        <button type="submit" className={`${btn.outline} w-full !py-3.5`}>
          <GoogleIcon /> Continuer avec Google
        </button>
        <div className="flex items-center gap-3 text-xs font-semibold text-muted">
          <span className="h-px flex-1 bg-line" /> ou avec votre e-mail <span className="h-px flex-1 bg-line" />
        </div>

        <label className="block">
          <span className="mb-1.5 block text-sm font-bold">Prénom et nom</span>
          <input autoComplete="name" className={input} />
        </label>

        {role === "enseignant" && (
          <label className="block">
            <span className="mb-1.5 block text-sm font-bold">Matière principale</span>
            <select className={input} defaultValue="">
              <option value="" disabled>Choisir…</option>
              {SUBJECTS.map((s) => <option key={s}>{s}</option>)}
            </select>
          </label>
        )}

        <label className="block">
          <span className="mb-1.5 block text-sm font-bold">E-mail</span>
          <input type="email" autoComplete="email" className={input} placeholder="vous@exemple.com" />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-bold">Mot de passe</span>
          <input type="password" minLength={8} autoComplete="new-password" className={input} />
          <span className="mt-1 block text-xs text-muted">8 caractères minimum</span>
        </label>

        <label className="flex items-start gap-2 text-sm">
          <input type="checkbox" required className="mt-1 accent-[var(--color-brand-500)]" />
          <span>J&apos;accepte les conditions d&apos;utilisation et la politique de confidentialité.</span>
        </label>

        <button className={`${btn.primary} w-full !py-3.5`}>
          {role === "enseignant" ? "Créer mon profil enseignant" : "Créer mon compte"}
        </button>
        {role === "enseignant" && (
          <p className="text-center text-xs text-muted">Votre profil sera vérifié (diplômes et antécédents) avant sa mise en ligne.</p>
        )}
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        Déjà inscrit ?{" "}
        <Link href="/connexion" className="font-bold text-brand-600 hover:underline">Connexion</Link>
      </p>
    </div>
  );
}
