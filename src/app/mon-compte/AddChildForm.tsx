"use client";

import { useActionState, useEffect, useRef } from "react";
import { Plus } from "lucide-react";
import { addChild } from "@/app/actions/account";
import FormError from "@/components/FormError";
import { btn, input } from "@/components/ui";

export default function AddChildForm() {
  const [state, action, pending] = useActionState(addChild, undefined);
  const formRef = useRef<HTMLFormElement>(null);

  // Vide le formulaire après un ajout réussi
  useEffect(() => {
    if (state?.ok) formRef.current?.reset();
  }, [state]);

  return (
    <form ref={formRef} action={action} className="mt-6 grid gap-3 sm:grid-cols-[1.4fr_0.7fr_1fr_1fr_auto] sm:items-end">
      <label className="block">
        <span className="mb-1 block text-xs font-bold text-muted">Prénom</span>
        <input name="firstName" required className={`${input} !py-2.5`} />
      </label>
      <label className="block">
        <span className="mb-1 block text-xs font-bold text-muted">Âge</span>
        <input name="age" type="number" min={3} max={17} required className={`${input} !py-2.5`} />
      </label>
      <label className="block">
        <span className="mb-1 block text-xs font-bold text-muted">Garçon / fille</span>
        <select name="gender" required defaultValue="" className={`${input} !py-2.5`}>
          <option value="" disabled>Choisir…</option>
          <option value="garcon">Garçon</option>
          <option value="fille">Fille</option>
        </select>
      </label>
      <label className="block">
        <span className="mb-1 block text-xs font-bold text-muted">Niveau</span>
        <select name="level" defaultValue="Débutant" className={`${input} !py-2.5`}>
          <option>Débutant</option>
          <option>Intermédiaire</option>
          <option>Avancé</option>
        </select>
      </label>
      <button disabled={pending} className={`${btn.dark} !py-2.5`}>
        <Plus className="h-4 w-4" /> Ajouter
      </button>
      <div className="sm:col-span-5">
        <FormError state={state} />
      </div>
    </form>
  );
}
