import Link from "next/link";
import Logo from "./Logo";

const COLUMNS = [
  {
    title: "Étudier",
    links: [
      { href: "/enseignants", label: "Trouver un enseignant" },
      { href: "/espaces/hommes", label: "Espace Hommes" },
      { href: "/espaces/femmes", label: "Espace Femmes" },
      { href: "/espaces/enfants", label: "Espace Enfants" },
    ],
  },
  {
    title: "Enseigner",
    links: [
      { href: "/devenir-enseignant", label: "Devenir enseignant" },
      { href: "/connexion", label: "Espace enseignant" },
    ],
  },
  {
    title: "e-team",
    links: [
      { href: "/a-propos", label: "Qui sommes-nous ?" },
      { href: "/comment-ca-marche", label: "Comment ça marche" },
      { href: "/contact", label: "Contact" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="mt-24 bg-ink text-white">
      <div className="container-page grid gap-10 py-14 md:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div>
          <Logo light />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-navy-200">
            Son Rav, son moment, son étude. Des rendez-vous d&apos;étude de Torah personnalisés, en ligne, à votre rythme.
          </p>
        </div>
        {COLUMNS.map((col) => (
          <div key={col.title}>
            <h3 className="text-sm font-bold uppercase tracking-wider text-gold-300">{col.title}</h3>
            <ul className="mt-4 space-y-3">
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-navy-100 hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-white/10">
        <div className="container-page flex flex-col gap-2 py-6 text-xs text-navy-200 sm:flex-row sm:justify-between">
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
