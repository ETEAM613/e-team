import type { Metadata } from "next";
import { Mail } from "lucide-react";
import DemoForm from "@/components/DemoForm";
import PageHero from "@/components/PageHero";
import { btn, input } from "@/components/ui";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Parlons-en"
        text="Une question sur la plateforme, un conseil pour choisir votre enseignant, une demande de sponsoring ? Nous vous répondons rapidement."
        icon={<Mail className="h-7 w-7" />}
      />
      <div className="container-page max-w-3xl py-12">
        <DemoForm className="space-y-4 rounded-[2rem] border border-line bg-white p-7 sm:p-9">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-sm font-bold">Nom</span>
              <input required autoComplete="name" className={input} />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-bold">E-mail</span>
              <input type="email" required autoComplete="email" className={input} />
            </label>
          </div>
          <label className="block">
            <span className="mb-1.5 block text-sm font-bold">Sujet</span>
            <select className={input} defaultValue="Question générale">
              <option>Question générale</option>
              <option>Choisir un enseignant</option>
              <option>Sponsoring</option>
              <option>Devenir enseignant</option>
              <option>Signaler un problème</option>
            </select>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-bold">Message</span>
            <textarea required rows={6} className={input} />
          </label>
          <button className={`${btn.primary} w-full !py-3.5`}>Envoyer</button>
        </DemoForm>
      </div>
    </>
  );
}
