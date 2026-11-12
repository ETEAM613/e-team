import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  CalendarCheck,
  CheckCircle2,
  Compass,
  FileCheck2,
  Gift,
  HandCoins,
  HeartHandshake,
  Radio,
  RefreshCcw,
  Users,
  Zap,
} from "lucide-react";
import PageHero from "@/components/PageHero";
import { btn, eyebrow } from "@/components/ui";

export const metadata: Metadata = { title: "Comment ça marche" };

const STEPS = [
  { icon: Compass, t: "Explorez librement", d: "Parcourez les enseignants, les cours en direct et les binômes sans créer de compte.", c: "from-brand-400 to-brand-600" },
  { icon: CalendarCheck, t: "Réservez ou rejoignez", d: "Au moment de réserver, inscription simplifiée : un clic avec Google ou un formulaire minimal.", c: "from-sky-400 to-blue-600" },
  { icon: Gift, t: "1er cours gratuit", d: "Votre premier cours est offert, avec l'enseignant de votre choix.", c: "from-pink-400 to-rose-500" },
  { icon: RefreshCcw, t: "2e essai si besoin", d: "Pas satisfait ? Un deuxième cours gratuit avec un autre enseignant.", c: "from-fuchsia-400 to-purple-600" },
  { icon: HandCoins, t: "Votre choix", d: "Pour continuer : sponsoriser vos cours, ou demander un sponsoring.", c: "from-amber-400 to-orange-500" },
];

const RULES = [
  { icon: Zap, type: "SOS", access: "1:1 instantané", cost: "Inclus dans votre formule", cond: "Choix de sponsoring effectué", c: "text-rose-600 bg-rose-50" },
  { icon: Radio, type: "Cours en direct", access: "Groupe", cost: "Gratuit", cond: "Aucune", c: "text-teal-700 bg-teal-50" },
  { icon: Users, type: "Binôme", access: "Pair-à-pair", cost: "Gratuit", cond: "Compte vérifié", c: "text-emerald-700 bg-emerald-50" },
];

export default function HowItWorksPage() {
  return (
    <>
      <PageHero
        eyebrow="Comment ça marche"
        title="Simple, clair, sans surprise"
        text="Fixez votre créneau. Trouvez votre enseignant. Entamez votre parcours. Le reste — liens de cours, rappels, suivi — est automatique."
      />

      {/* Parcours */}
      <section className="container-page py-16">
        <p className={eyebrow}>Votre parcours</p>
        <h2 className="mt-3 text-4xl font-extrabold">Étape par étape</h2>
        <ol className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          {STEPS.map(({ icon: Icon, t, d, c }, i) => (
            <li key={t} className="relative rounded-[2rem] border border-line bg-white p-6">
              <span className="absolute right-5 top-5 font-display text-4xl font-extrabold text-surface">{i + 1}</span>
              <span className={`relative grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br text-white ${c}`}>
                <Icon className="h-6 w-6" />
              </span>
              <h3 className="relative mt-5 text-lg font-extrabold">{t}</h3>
              <p className="relative mt-2 text-sm leading-relaxed text-muted">{d}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Sponsoring */}
      <section id="sponsoring" className="mesh-light scroll-mt-24 border-y border-line py-16">
        <div className="container-page">
          <p className={eyebrow}>Le choix après l&apos;essai</p>
          <h2 className="mt-3 max-w-3xl text-4xl font-extrabold">Sponsoriser, ou être sponsorisé</h2>
          <p className="mt-3 max-w-2xl text-lg text-muted">
            Ce choix est obligatoire pour continuer à réserver. Il garantit que chacun peut étudier, quels que soient ses moyens.
          </p>
          <div className="mt-10 grid gap-5 lg:grid-cols-2">
            <div className="rounded-[2rem] bg-ink p-8 text-white sm:p-10">
              <span className="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-bold ring-1 ring-white/20">Option A</span>
              <h3 className="mt-5 text-3xl font-extrabold">Je sponsorise</h3>
              <ul className="mt-6 space-y-3 text-white/85">
                <li className="flex gap-3"><CheckCircle2 className="h-5 w-5 shrink-0 text-brand-300" /> 10 € par cours suivi, facturés une fois par mois (ex. : 3 cours = 30 €)</li>
                <li className="flex gap-3"><CheckCircle2 className="h-5 w-5 shrink-0 text-brand-300" /> Paiement sécurisé par carte</li>
                <li className="flex gap-3"><CheckCircle2 className="h-5 w-5 shrink-0 text-brand-300" /> 80 % pour l&apos;enseignant, 20 % pour le fonctionnement de la plateforme</li>
                <li className="flex gap-3"><HeartHandshake className="h-5 w-5 shrink-0 text-pink-300" /> « Vous avez sponsorisé 12 cours ! »</li>
              </ul>
            </div>
            <div className="rounded-[2rem] bg-gradient-to-br from-pink-500 via-rose-500 to-orange-400 p-8 text-white sm:p-10">
              <span className="inline-flex rounded-full bg-white/20 px-3 py-1 text-xs font-bold ring-1 ring-white/30">Option B</span>
              <h3 className="mt-5 text-3xl font-extrabold">Je demande un sponsoring</h3>
              <ul className="mt-6 space-y-3 text-white/90">
                <li className="flex gap-3"><FileCheck2 className="h-5 w-5 shrink-0" /> Envoyez un justificatif, en toute confidentialité</li>
                <li className="flex gap-3"><CheckCircle2 className="h-5 w-5 shrink-0" /> L&apos;équipe examine votre demande sous 24 h</li>
                <li className="flex gap-3"><Gift className="h-5 w-5 shrink-0" /> 10 crédits de cours offerts par la cagnotte de dons</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Règles de session */}
      <section className="container-page py-16">
        <p className={eyebrow}>Règles de session</p>
        <h2 className="mt-3 text-4xl font-extrabold">Qui a accès à quoi ?</h2>
        <div className="mt-8 overflow-hidden rounded-[2rem] border border-line bg-white">
          <div className="hidden grid-cols-4 gap-4 border-b border-line bg-surface px-6 py-4 text-sm font-bold text-muted md:grid">
            <span>Type</span><span>Accès</span><span>Coût</span><span>Conditions</span>
          </div>
          {RULES.map(({ icon: Icon, type, access, cost, cond, c }) => (
            <div key={type} className="grid gap-2 border-b border-line px-6 py-5 last:border-0 md:grid-cols-4 md:items-center md:gap-4">
              <span className="flex items-center gap-3 font-extrabold">
                <span className={`grid h-10 w-10 place-items-center rounded-xl ${c}`}><Icon className="h-5 w-5" /></span>
                {type}
              </span>
              <span className="text-muted"><span className="font-semibold text-ink md:hidden">Accès : </span>{access}</span>
              <span className="font-semibold"><span className="md:hidden">Coût : </span>{cost}</span>
              <span className="text-muted"><span className="font-semibold text-ink md:hidden">Conditions : </span>{cond}</span>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-wrap gap-3">
          <Link href="/enseignants" className={btn.primary}>
            Mon premier cours gratuit <ArrowRight className="h-5 w-5" />
          </Link>
          <Link href="/contact" className={btn.outline}>Une question ?</Link>
        </div>
      </section>
    </>
  );
}
