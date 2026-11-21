"use client";

import { useActionState } from "react";
import { saveTeacherProfile } from "@/app/actions/account";
import { LANGUAGES, MOMENTS, SUBJECTS, type Gender } from "@/lib/data";
import FormError from "@/components/FormError";
import { btn, input } from "@/components/ui";

type Initial = {
  displayName: string;
  title: string;
  headline: string;
  bio: string;
  country: string;
  experience: string;
  subjects: string[];
  languages: string[];
  levels: string[];
  available: string[];
  kids: string[];
};

function Checks({ name, options, selected }: { name: string; options: { value: string; label: string }[]; selected: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <label
          key={o.value}
          className="flex cursor-pointer items-center gap-2 rounded-full border border-line bg-white px-3.5 py-2 text-sm font-semibold has-[:checked]:border-brand-500 has-[:checked]:bg-brand-50 has-[:checked]:text-brand-700"
        >
          <input type="checkbox" name={name} value={o.value} defaultChecked={selected.includes(o.value)} className="accent-[var(--color-brand-500)]" />
          {o.label}
        </label>
      ))}
    </div>
  );
}

const asOptions = (list: readonly string[]) => list.map((v) => ({ value: v, label: v }));

export default function TeacherProfileForm({ initial, gender, approved }: { initial: Initial; gender: Gender; approved: boolean }) {
  const [state, action, pending] = useActionState(saveTeacherProfile, undefined);

  return (
    <form action={action} className="mt-8 space-y-6 rounded-[2rem] border border-line bg-white p-6 sm:p-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-sm font-bold">Nom affiché</span>
          <input name="displayName" required defaultValue={initial.displayName} className={input} placeholder="Rav David Cohen" />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-bold">Titre</span>
          <input name="title" required defaultValue={initial.title} className={input} placeholder="Rav · Roch Collel" />
        </label>
      </div>
      <label className="block">
        <span className="mb-1.5 block text-sm font-bold">Phrase d&apos;accroche</span>
        <input name="headline" required maxLength={200} defaultValue={initial.headline} className={input} placeholder="La Guemara pas à pas, avec méthode et clarté" />
      </label>
      <label className="block">
        <span className="mb-1.5 block text-sm font-bold">Présentation</span>
        <textarea name="bio" required rows={5} maxLength={3000} defaultValue={initial.bio} className={input} placeholder="Votre parcours, votre façon d'enseigner, ce que l'élève va apprendre…" />
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-sm font-bold">Pays</span>
          <input name="country" required defaultValue={initial.country} className={input} placeholder="France" />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-bold">Parcours (une ligne par élément)</span>
          <textarea name="experience" rows={3} defaultValue={initial.experience} className={input} placeholder={"Roch Collel (15 ans)\nSemikha du Rabbinat"} />
        </label>
      </div>

      <div>
        <p className="mb-2 text-sm font-bold">Matières enseignées</p>
        <Checks name="subjects" options={asOptions(SUBJECTS)} selected={initial.subjects} />
      </div>
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <p className="mb-2 text-sm font-bold">Langues</p>
          <Checks name="languages" options={asOptions(LANGUAGES)} selected={initial.languages} />
        </div>
        <div>
          <p className="mb-2 text-sm font-bold">Niveaux</p>
          <Checks name="levels" options={asOptions(["Débutant", "Intermédiaire", "Avancé"])} selected={initial.levels} />
        </div>
        <div>
          <p className="mb-2 text-sm font-bold">Disponibilités</p>
          <Checks name="available" options={MOMENTS.map((m) => ({ value: m.value, label: m.label }))} selected={initial.available} />
        </div>
        <div>
          <p className="mb-2 text-sm font-bold">Élèves</p>
          <p className="mb-2 text-xs text-muted">Vous recevez les {gender === "homme" ? "hommes" : "femmes"}. Vous pouvez aussi accepter des enfants :</p>
          <Checks
            name="kids"
            options={[
              { value: "garcon", label: "Garçons" },
              { value: "fille", label: "Filles" },
            ]}
            selected={initial.kids}
          />
        </div>
      </div>

      <FormError state={state} />

      <div className="flex flex-wrap gap-3">
        {approved ? (
          <button name="intent" value="submit" disabled={pending} className={btn.primary}>Enregistrer les modifications</button>
        ) : (
          <>
            <button name="intent" value="submit" disabled={pending} className={btn.primary}>Envoyer pour validation</button>
            <button name="intent" value="draft" disabled={pending} formNoValidate className={btn.outline}>Enregistrer le brouillon</button>
          </>
        )}
      </div>
    </form>
  );
}
