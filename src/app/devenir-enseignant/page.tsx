import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CalendarClock, Globe, Video, Wallet } from "lucide-react";

export const metadata: Metadata = { title: "Devenir enseignant" };

const BENEFITS = [
  { icon: CalendarClock, title: "Vos horaires", text: "Définissez vos disponibilités. Les élèves réservent uniquement sur vos créneaux libres." },
  { icon: Wallet, title: "Vos tarifs", text: "Fixez le prix de vos cours et de votre cours d'essai. Paiement sécurisé et versements réguliers." },
  { icon: Video, title: "Zéro organisation", text: "Le lien Google Meet, les e-mails de confirmation et les rappels sont envoyés automatiquement." },
  { icon: Globe, title: "Des élèves partout", text: "France, Israël, Belgique, Canada… transmettez à des élèves motivés du monde entier." },
];

const STEPS = [
  "Créez votre compte enseignant",
  "Complétez votre profil : parcours, matières, présentation",
  "Votre profil est vérifié par l'équipe e-team",
  "Indiquez vos disponibilités et vos tarifs",
  "Recevez vos premières réservations",
];

export default function BecomeTeacherPage() {
  return (
    <>
      <section className="container-page grid gap-10 py-14 lg:grid-cols-[1.2fr_1fr] lg:items-center">
        <div>
          <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-6xl">
            Transmettez la Torah, <span className="text-gold-500">nous nous occupons du reste.</span>
          </h1>
          <p className="mt-5 max-w-xl text-lg text-muted">
            Rav, Avrekh, enseignante ou Morah : rejoignez e-team et créez des liens d&apos;étude durables avec vos élèves.
          </p>
          <Link href="/inscription?role=enseignant" className="mt-8 inline-flex items-center gap-2 rounded-xl bg-gold-400 px-7 py-4 font-bold text-ink hover:bg-gold-300">
            Créer mon profil enseignant <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
        <div className="rounded-3xl border-2 border-ink bg-white p-7 shadow-[6px_6px_0_0_var(--color-ink)]">
          <h2 className="text-xl font-extrabold">Les étapes</h2>
          <ol className="mt-5 space-y-4">
            {STEPS.map((s, i) => (
              <li key={s} className="flex items-center gap-4">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-ink font-extrabold text-white">{i + 1}</span>
                <span className="font-semibold">{s}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-sand py-16">
        <div className="container-page grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {BENEFITS.map(({ icon: Icon, title, text }) => (
            <div key={title} className="rounded-3xl bg-white p-6 ring-1 ring-line">
              <Icon className="h-7 w-7 text-gold-500" />
              <h3 className="mt-4 text-lg font-extrabold">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{text}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
