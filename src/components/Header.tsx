"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import Logo from "./Logo";

const NAV = [
  { href: "/enseignants", label: "Trouver un enseignant" },
  { href: "/espaces/hommes", label: "Hommes" },
  { href: "/espaces/femmes", label: "Femmes" },
  { href: "/espaces/enfants", label: "Enfants" },
  { href: "/comment-ca-marche", label: "Comment ça marche" },
  { href: "/devenir-enseignant", label: "Devenir enseignant" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-cream/90 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Logo />

        <nav className="hidden items-center gap-0.5 whitespace-nowrap xl:flex" aria-label="Navigation principale">
          {NAV.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
                  active ? "bg-navy-50 text-navy-700" : "text-ink hover:bg-sand"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-2 whitespace-nowrap xl:flex">
          <Link href="/connexion" className="rounded-lg px-4 py-2 text-sm font-semibold text-ink hover:bg-sand">
            Connexion
          </Link>
          <Link
            href="/inscription"
            className="rounded-lg border-2 border-ink bg-ink px-4 py-2 text-sm font-bold text-white transition hover:bg-navy-700"
          >
            S&apos;inscrire
          </Link>
        </div>

        <button
          type="button"
          className="grid h-10 w-10 place-items-center rounded-lg hover:bg-sand xl:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={open}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-line bg-cream xl:hidden">
          <nav className="container-page flex flex-col py-3" aria-label="Navigation mobile">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-3 font-semibold text-ink hover:bg-sand"
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-3 grid grid-cols-2 gap-2">
              <Link href="/connexion" onClick={() => setOpen(false)} className="rounded-lg border-2 border-ink px-4 py-3 text-center font-semibold">
                Connexion
              </Link>
              <Link href="/inscription" onClick={() => setOpen(false)} className="rounded-lg bg-ink px-4 py-3 text-center font-bold text-white">
                S&apos;inscrire
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
