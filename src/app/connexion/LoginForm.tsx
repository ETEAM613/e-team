"use client";

import Link from "next/link";
import { useActionState } from "react";
import { login } from "@/app/actions/auth";
import FormError from "@/components/FormError";
import { btn, input } from "@/components/ui";

export default function LoginForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState(login, undefined);

  return (
    <div className="w-full max-w-md rounded-[2rem] border border-line bg-white p-7 shadow-2xl shadow-brand-500/10 sm:p-9">
      <h1 className="text-3xl font-extrabold">Connexion</h1>
      <p className="mt-2 text-muted">Heureux de vous revoir !</p>

      <form action={action} className="mt-7 space-y-4">
        <input type="hidden" name="suite" value={next} />
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
          <input type="password" name="password" required autoComplete="current-password" className={input} />
        </label>
        <div className="text-right">
          <Link href="/mot-de-passe-oublie" className="text-sm font-semibold text-brand-600 hover:underline">
            Mot de passe oublié ?
          </Link>
        </div>
        <FormError state={state} />
        <button disabled={pending} className={`${btn.primary} w-full !py-3.5`}>
          {pending ? "Connexion…" : "Se connecter"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        Pas encore de compte ?{" "}
        <Link href="/inscription" className="font-bold text-brand-600 hover:underline">Inscrivez-vous</Link>
      </p>
    </div>
  );
}
