"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Heart, Menu, X } from "lucide-react";
import Logo from "./Logo";
import { useAudience } from "@/lib/audience";
import { btn } from "./ui";

type NavItem = { href: string; label: string; badge?: "live" | "sos"; womenOnly?: boolean };

const NAV: NavItem[] = [
  { href: "/enseignants", label: "Enseignants" },
  { href: "/cours-en-direct", label: "Cours en direct", badge: "live" },
  { href: "/sos", label: "SOS", badge: "sos" },
  { href: "/binome", label: "Binôme" },
  { href: "/enfants", label: "Enfants" },
  { href: "/femmes", label: "Femmes", womenOnly: true },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const audience = useAudience();
  // L'espace Femmes est caché aux hommes
  const items = NAV.filter((i) => !(i.womenOnly && audience === "homme"));

  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-white/80 backdrop-blur-xl">
      <div className="container-page flex h-[72px] items-center justify-between gap-4">
        <Logo />

        <nav className="hidden items-center gap-1 whitespace-nowrap xl:flex" aria-label="Navigation principale">
          {items.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[15px] font-semibold transition ${
                  active ? "bg-brand-50 text-brand-700" : "text-ink hover:bg-surface"
                }`}
              >
                {item.badge === "live" && <span className="live-dot" />}
                {item.badge === "sos" && <span className="h-2 w-2 rounded-full bg-rose-500" />}
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-2 whitespace-nowrap xl:flex">
          <Link
            href="/don"
            className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 px-4 py-2 text-sm font-bold text-white shadow-md shadow-pink-500/25 transition hover:brightness-110"
          >
            <Heart className="h-4 w-4 fill-white" /> Faire un don
          </Link>
          <Link href="/connexion" className="rounded-full px-4 py-2 text-sm font-semibold text-ink hover:bg-surface">
            Connexion
          </Link>
          <Link href="/inscription" className={`${btn.dark} !px-5 !py-2 text-sm`}>
            S&apos;inscrire
          </Link>
        </div>

        <div className="flex items-center gap-2 xl:hidden">
          <Link
            href="/don"
            className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 px-3 py-2 text-sm font-bold text-white"
          >
            <Heart className="h-4 w-4 fill-white" /> <span className="hidden sm:inline">Faire un don</span>
          </Link>
          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-full hover:bg-surface"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={open}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-line bg-white xl:hidden">
          <nav className="container-page flex flex-col py-3" aria-label="Navigation mobile">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 rounded-2xl px-3 py-3 font-semibold text-ink hover:bg-surface"
              >
                {item.badge === "live" && <span className="live-dot" />}
                {item.badge === "sos" && <span className="h-2 w-2 rounded-full bg-rose-500" />}
                {item.label}
              </Link>
            ))}
            <div className="mt-3 grid grid-cols-2 gap-2">
              <Link href="/connexion" onClick={() => setOpen(false)} className={btn.outline}>
                Connexion
              </Link>
              <Link href="/inscription" onClick={() => setOpen(false)} className={btn.dark}>
                S&apos;inscrire
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
