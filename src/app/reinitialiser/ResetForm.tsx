"use client";

import { useActionState } from "react";
import { resetPassword } from "@/app/actions/auth";
import FormError from "@/components/FormError";
import { btn, input } from "@/components/ui";

export default function ResetForm({ token }: { token: string }) {
  const [state, action, pending] = useActionState(resetPassword, undefined);
  return (
    <div className="w-full max-w-md rounded-[2rem] border border-line bg-white p-7 sm:p-9">
      <h1 className="text-3xl font-extrabold">Nouveau mot de passe</h1>
      <form action={action} className="mt-6 space-y-4">
        <input type="hidden" name="jeton" value={token} />
        <label className="block">
          <span className="mb-1.5 block text-sm font-bold">Nouveau mot de passe</span>
          <input type="password" name="password" required minLength={8} autoComplete="new-password" className={input} />
          <span className="mt-1 block text-xs text-muted">8 caractères minimum</span>
        </label>
        <FormError state={state} />
        <button disabled={pending} className={`${btn.primary} w-full`}>{pending ? "Enregistrement…" : "Enregistrer"}</button>
      </form>
    </div>
  );
}
