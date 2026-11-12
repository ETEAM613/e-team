import type { Metadata } from "next";
import Link from "next/link";
import { BarChart3, Heart, ShieldCheck } from "lucide-react";
import PageHero from "@/components/PageHero";
import DonationForm from "./DonationForm";

export const metadata: Metadata = { title: "Faire un don" };

export default function DonatePage() {
  return (
    <>
      <PageHero
        eyebrow="Cagnotte de dons"
        title="Offrez l'étude de la Torah à ceux qui n'en ont pas les moyens"
        text="100 % de votre don finance les cours des élèves sponsorisés. Chaque cours financé rémunère un enseignant 8 €."
        gradient="from-pink-500 via-rose-500 to-orange-400"
        icon={<Heart className="h-7 w-7 fill-white" />}
      />
      <div className="container-page grid gap-8 py-12 lg:grid-cols-[1.2fr_1fr]">
        <DonationForm />
        <aside className="space-y-4">
          <div className="rounded-[2rem] border border-line bg-white p-7">
            <ShieldCheck className="h-7 w-7 text-emerald-500" />
            <h2 className="mt-4 text-xl font-extrabold">Fonds séparés</h2>
            <p className="mt-2 text-muted">
              Les dons vont exclusivement à la cagnotte des élèves sponsorisés. Ils ne financent jamais le fonctionnement de la plateforme.
            </p>
          </div>
          <div className="rounded-[2rem] bg-ink p-7 text-white">
            <BarChart3 className="h-7 w-7 text-brand-300" />
            <h2 className="mt-4 text-xl font-extrabold">Transparence totale</h2>
            <p className="mt-2 text-white/70">Montants collectés, cours financés, enseignants rémunérés : tout est public.</p>
            <Link href="/transparence" className="mt-5 inline-flex rounded-full bg-white px-5 py-2.5 font-bold text-ink hover:bg-brand-50">
              Voir le tableau de transparence
            </Link>
          </div>
        </aside>
      </div>
    </>
  );
}
