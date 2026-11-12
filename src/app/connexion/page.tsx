import type { Metadata } from "next";
import Link from "next/link";
import DemoForm, { inputCls } from "@/components/DemoForm";

export const metadata: Metadata = { title: "Connexion" };

export default function LoginPage() {
  return (
    <div className="container-page grid place-items-center py-16">
      <div className="w-full max-w-md rounded-3xl border-2 border-ink bg-white p-7 shadow-[6px_6px_0_0_var(--color-ink)] sm:p-9">
        <h1 className="text-3xl font-extrabold">Connexion</h1>
        <p className="mt-2 text-muted">Heureux de vous revoir !</p>

        <DemoForm className="mt-7 space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-sm font-bold">E-mail</span>
            <input type="email" required autoComplete="email" className={inputCls} placeholder="vous@exemple.com" />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-bold">Mot de passe</span>
            <input type="password" required autoComplete="current-password" className={inputCls} />
          </label>
          <div className="text-right">
            <Link href="/mot-de-passe-oublie" className="text-sm font-semibold underline-offset-4 hover:underline">
              Mot de passe oublié ?
            </Link>
          </div>
          <button className="w-full rounded-xl bg-ink px-5 py-3.5 font-bold text-white hover:bg-navy-700">Se connecter</button>
        </DemoForm>

        <p className="mt-6 text-center text-sm text-muted">
          Pas encore de compte ?{" "}
          <Link href="/inscription" className="font-bold text-ink underline-offset-4 hover:underline">
            Inscrivez-vous
          </Link>
        </p>
      </div>
    </div>
  );
}
