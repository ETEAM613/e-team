import type { Metadata } from "next";
import DemoForm, { inputCls } from "@/components/DemoForm";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <div className="container-page grid gap-10 py-14 lg:grid-cols-[1fr_1.2fr]">
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">Contactez-nous</h1>
        <p className="mt-4 text-lg text-muted">
          Une question sur la plateforme, un conseil pour choisir votre enseignant, ou l&apos;envie de rejoindre l&apos;équipe ?
          Écrivez-nous, nous vous répondons rapidement.
        </p>
      </div>
      <DemoForm className="space-y-4 rounded-3xl border-2 border-ink bg-white p-7 shadow-[6px_6px_0_0_var(--color-ink)]">
        <label className="block">
          <span className="mb-1.5 block text-sm font-bold">Nom</span>
          <input required autoComplete="name" className={inputCls} />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-bold">E-mail</span>
          <input type="email" required autoComplete="email" className={inputCls} />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-bold">Message</span>
          <textarea required rows={5} className={inputCls} />
        </label>
        <button className="w-full rounded-xl bg-ink px-5 py-3.5 font-bold text-white hover:bg-navy-700">Envoyer</button>
      </DemoForm>
    </div>
  );
}
