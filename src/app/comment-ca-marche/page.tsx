import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Bell, CalendarCheck, MessageCircle, Search, UserPlus, Video } from "lucide-react";

export const metadata: Metadata = { title: "Comment ça marche" };

const STEPS = [
  { icon: UserPlus, title: "Créez votre compte", text: "Inscription gratuite en une minute, comme élève ou comme parent pour un enfant." },
  { icon: Search, title: "Trouvez votre enseignant", text: "Filtrez par matière, espace, langue, horaires et budget. Lisez les profils et les avis." },
  { icon: MessageCircle, title: "Échangez avant de réserver", text: "Posez vos questions à l'enseignant par la messagerie intégrée." },
  { icon: CalendarCheck, title: "Réservez un cours d'essai", text: "25 minutes pour faire connaissance et définir vos objectifs. Choisissez le créneau qui vous convient." },
  { icon: Video, title: "Recevez votre lien Google Meet", text: "Dès la confirmation, le lien est créé automatiquement et envoyé par e-mail à vous et à l'enseignant." },
  { icon: Bell, title: "Étudiez régulièrement", text: "Rappels avant chaque cours, suivi de vos progrès et réservation de vos prochains créneaux." },
];

export default function HowItWorksPage() {
  return (
    <div className="container-page py-14">
      <h1 className="max-w-3xl text-4xl font-extrabold tracking-tight sm:text-5xl">Comment ça marche ?</h1>
      <p className="mt-4 max-w-2xl text-lg text-muted">
        Fixez votre créneau. Trouvez votre enseignant. Entamez votre parcours. Tout est automatique : vous n&apos;avez qu&apos;à étudier.
      </p>

      <ol className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {STEPS.map(({ icon: Icon, title, text }, i) => (
          <li key={title} className="rounded-3xl border-2 border-ink bg-white p-7">
            <div className="flex items-center justify-between">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gold-400">
                <Icon className="h-6 w-6" />
              </span>
              <span className="text-4xl font-extrabold text-line">{String(i + 1).padStart(2, "0")}</span>
            </div>
            <h2 className="mt-5 text-xl font-extrabold">{title}</h2>
            <p className="mt-2 leading-relaxed text-muted">{text}</p>
          </li>
        ))}
      </ol>

      <div className="mt-14 flex flex-wrap gap-3">
        <Link href="/enseignants" className="inline-flex items-center gap-2 rounded-xl bg-ink px-6 py-3.5 font-bold text-white hover:bg-navy-700">
          Trouver mon enseignant <ArrowRight className="h-5 w-5" />
        </Link>
        <Link href="/contact" className="rounded-xl border-2 border-ink px-6 py-3.5 font-bold hover:bg-white">
          Nous contacter
        </Link>
      </div>
    </div>
  );
}
