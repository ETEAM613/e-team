"use client";

import { useActionState } from "react";
import { requestPasswordReset } from "@/app/actions/auth";
import FormError from "@/components/FormError";
import { btn, input } from "@/components/ui";

export default function ForgotPasswordPage() {
  const [state, action, pending] = useActionState(requestPasswordReset, undefined);
  return (
    <div className="mesh-light">
      <div className="container-page grid place-items-center py-16">
        <div className="w-full max-w-md rounded-[2rem] border border-line bg-white p-7 sm:p-9">
          <h1 className="text-3xl font-extrabold">Mot de passe oublié</h1>
          <p className="mt-2 text-muted">Indiquez votre e-mail : nous vous envoyons un lien pour en choisir un nouveau.</p>
          <form action={action} className="mt-6 space-y-4">
            <input type="email" name="email" required autoComplete="email" className={input} placeholder="vous@exemple.com" />
            <FormError state={state} />
            <button disabled={pending} className={`${btn.primary} w-full`}>{pending ? "Envoi…" : "Recevoir le lien"}</button>
          </form>
        </div>
      </div>
    </div>
  );
}
