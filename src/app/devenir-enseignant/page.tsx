import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BadgeCheck, CalendarClock, Globe, Radio, Video, Wallet } from "lucide-react";
import PageHero from "@/components/PageHero";
import { btn } from "@/components/ui";

export const metadata: Metadata = { title: "Devenir enseignant" };

const BENEFITS = [
  { icon: CalendarClock, title: "Vos horaires", text: "Vous définissez vos disponibilités et activez le statut « Disponible maintenant » pour le SOS.", c: "from-brand-400 to-brand-600" },
  { icon: Wallet, title: "Rémunération fixe", text: "8 € par cours, quel que soit l'élève (sponsor ou sponsorisé). Pas de tarif à négocier.", c: "from-emerald-400 to-teal-600" },
  { icon: Video, title: "Zéro organisation", text: "Lien Google Meet, e-mails de confirmation et rappels envoyés automatiquement.", c: "from-sky-400 to-blue-600" },
  { icon: Radio, title: "Cours en direct", text: "Proposez des cours de groupe gratuits : publiés après validation par l'équipe.", c: "from-teal-400 to-cyan-600" },
  { icon: Globe, title: "Des élèves partout", text: "France, Israël, Belgique, Canada… des élèves motivés du monde entier.", c: "from-pink-400 to-rose-500" },
  { icon: BadgeCheck, title: "Un cadre sérieux", text: "Tous les enseignants sont vérifiés par l'équipe e-team.", c: "from-amber-400 to-orange-500" },
];

const STEPS = [
  "Créez votre compte enseignant",
  "Complétez votre profil : parcours, matières, publics acceptés",
  "Envoyez vos diplômes pour vérification",
  "Contrôle des antécédents par l'équipe e-team",
  "Profil validé : recevez vos premières réservations",
];

export default function BecomeTeacherPage() {
  return (
    <>
      <PageHero
        eyebrow="Devenir enseignant"
        title="Transmettez la Torah, nous nous occupons du reste"
        text="Rav, Avrekh, enseignante ou Morah : rejoignez e-team et créez des liens d'étude durables avec vos élèves."
        gradient="from-brand-500 via-brand-600 to-indigo-700"
      >
        <Link href="/inscription?role=enseignant" className={btn.light}>
          Créer mon profil enseignant <ArrowRight className="h-5 w-5" />
        </Link>
      </PageHero>

      <section className="container-page grid gap-4 py-14 sm:grid-cols-2 lg:grid-cols-3">
        {BENEFITS.map(({ icon: Icon, title, text, c }) => (
          <div key={title} className="rounded-[2rem] border border-line bg-white p-7">
            <span className={`grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br text-white ${c}`}>
              <Icon className="h-6 w-6" />
            </span>
            <h3 className="mt-5 text-xl font-extrabold">{title}</h3>
            <p className="mt-2 leading-relaxed text-muted">{text}</p>
          </div>
        ))}
      </section>

      <section className="container-page">
        <div className="mesh-dark grid gap-10 rounded-[2.5rem] p-8 text-white sm:p-12 lg:grid-cols-[1fr_1.2fr] lg:items-center">
          <div>
            <h2 className="text-4xl font-extrabold">Comment rejoindre e-team</h2>
            <p className="mt-3 text-white/70">Chaque profil est vérifié avant sa mise en ligne : diplômes et contrôle des antécédents.</p>
          </div>
          <ol className="space-y-3">
            {STEPS.map((s, i) => (
              <li key={s} className="glass flex items-center gap-4 rounded-2xl p-4">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white font-display font-extrabold text-ink">{i + 1}</span>
                <span className="font-semibold">{s}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}
