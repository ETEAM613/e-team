import type { Metadata } from "next";
import Link from "next/link";
import DemoForm from "@/components/DemoForm";
import GoogleIcon from "@/components/GoogleIcon";
import { btn, input } from "@/components/ui";

export const metadata: Metadata = { title: "Connexion" };

export default function LoginPage() {
  return (
    <div className="mesh-light">
      <div className="container-page grid place-items-center py-16">
        <div className="w-full max-w-md rounded-[2rem] border border-line bg-white p-7 shadow-2xl shadow-brand-500/10 sm:p-9">
          <h1 className="text-3xl font-extrabold">Connexion</h1>
          <p className="mt-2 text-muted">Heureux de vous revoir !</p>

          <DemoForm className="mt-7 space-y-4">
            <button type="submit" className={`${btn.outline} w-full !py-3.5`}>
              <GoogleIcon /> Continuer avec Google
            </button>
            <div className="flex items-center gap-3 text-xs font-semibold text-muted">
              <span className="h-px flex-1 bg-line" /> ou <span className="h-px flex-1 bg-line" />
            </div>
            <label className="block">
              <span className="mb-1.5 block text-sm font-bold">E-mail</span>
              <input type="email" required autoComplete="email" className={input} placeholder="vous@exemple.com" />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-bold">Mot de passe</span>
              <input type="password" required autoComplete="current-password" className={input} />
            </label>
            <div className="text-right">
              <Link href="/mot-de-passe-oublie" className="text-sm font-semibold text-brand-600 hover:underline">
                Mot de passe oublié ?
              </Link>
            </div>
            <button className={`${btn.primary} w-full !py-3.5`}>Se connecter</button>
          </DemoForm>

          <p className="mt-6 text-center text-sm text-muted">
            Pas encore de compte ?{" "}
            <Link href="/inscription" className="font-bold text-brand-600 hover:underline">Inscrivez-vous</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
