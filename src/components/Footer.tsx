import Link from "next/link";
import { Heart } from "lucide-react";
import Logo from "./Logo";

const COLUMNS = [
  {
    title: "Étudier",
    links: [
      { href: "/enseignants", label: "Trouver un enseignant" },
      { href: "/cours-en-direct", label: "Cours en direct" },
      { href: "/sos", label: "SOS — tout de suite" },
      { href: "/binome", label: "Binôme" },
      { href: "/enfants", label: "Enfants" },
    ],
  },
  {
    title: "Soutenir",
    links: [
      { href: "/don", label: "Faire un don" },
      { href: "/transparence", label: "Transparence" },
      { href: "/comment-ca-marche#sponsoring", label: "Sponsoring" },
    ],
  },
  {
    title: "e-team",
    links: [
      { href: "/a-propos", label: "Qui sommes-nous ?" },
      { href: "/comment-ca-marche", label: "Comment ça marche" },
      { href: "/devenir-enseignant", label: "Devenir enseignant" },
      { href: "/contact", label: "Contact" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="mesh-dark mt-24 text-white">
      <div className="container-page grid gap-10 py-16 md:grid-cols-[1.5fr_repeat(3,1fr)]">
        <div>
          <Logo light />
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/70">
            Son Rav, son moment, son étude. Des rendez-vous d&apos;étude de Torah personnalisés, en ligne, à votre rythme.
          </p>
          <Link
            href="/don"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-bold ring-1 ring-white/20 transition hover:bg-white/20"
          >
            <Heart className="h-4 w-4 fill-pink-400 text-pink-400" /> Soutenir un élève
          </Link>
        </div>
        {COLUMNS.map((col) => (
          <div key={col.title}>
            <h3 className="text-sm font-bold uppercase tracking-[0.14em] text-brand-300">{col.title}</h3>
            <ul className="mt-4 space-y-3">
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-white/75 transition hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-white/10">
        <div className="container-page flex flex-col gap-2 py-6 text-xs text-white/55 sm:flex-row sm:justify-between">
          <p>© 2026 e-team — La Torah Connectée</p>
          <div className="flex gap-4">
            <Link href="/mentions-legales" className="hover:text-white">Mentions légales</Link>
            <Link href="/confidentialite" className="hover:text-white">Confidentialité</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
