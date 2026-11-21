"use client";

import Link from "next/link";
import { ArrowUpRight, Baby, HeartHandshake, Lock, Radio, Search, Users, Zap } from "lucide-react";
import { useGender } from "@/lib/profile";

function Tag({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
        dark ? "bg-ink/10 text-ink" : "bg-white/20 text-white ring-1 ring-white/25"
      }`}
    >
      {children}
    </span>
  );
}

function Arrow() {
  return (
    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white text-ink transition group-hover:rotate-45">
      <ArrowUpRight className="h-5 w-5" />
    </span>
  );
}

/** Les 5 modules de la page d'accueil (cahier des charges §1). */
export default function ModulesGrid() {
  const hideWomen = useGender() === "homme";

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {/* 1. Recherche principale */}
      <Link
        href="/enseignants"
        className="group relative flex min-h-[320px] flex-col overflow-hidden rounded-[2rem] bg-gradient-to-br from-brand-500 via-brand-600 to-indigo-700 p-7 text-white md:col-span-2 sm:p-9"
      >
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-pink-400/30 blur-3xl" aria-hidden />
        <div className="relative flex items-start justify-between gap-4">
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-white/15 ring-1 ring-white/25">
            <Search className="h-7 w-7" />
          </span>
          <Arrow />
        </div>
        <div className="relative mt-auto">
          <div className="flex flex-wrap gap-2">
            <Tag>Navigation libre</Tag>
            <Tag>1er cours gratuit</Tag>
          </div>
          <h3 className="mt-4 text-3xl font-extrabold sm:text-4xl">Trouver mon enseignant</h3>
          <p className="mt-2 max-w-lg text-white/80">
            Filtrez par matière, disponibilités, public et langue. Des Rabbanim et des enseignantes vérifiés.
          </p>
          <div className="mt-5 hidden flex-wrap gap-2 sm:flex" aria-hidden>
            {["Guemara", "Halakha", "Paracha", "Le soir", "Français"].map((f) => (
              <span key={f} className="rounded-full bg-white px-3.5 py-1.5 text-sm font-bold text-brand-700">{f}</span>
            ))}
          </div>
        </div>
      </Link>

      {/* 5. SOS */}
      <Link
        href="/sos"
        className="group relative flex min-h-[320px] flex-col overflow-hidden rounded-[2rem] bg-gradient-to-br from-rose-500 via-red-500 to-orange-500 p-7 text-white"
      >
        <div className="flex items-start justify-between">
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-white/15 ring-1 ring-white/25">
            <Zap className="h-7 w-7 fill-white" />
          </span>
          <Arrow />
        </div>
        <div className="mt-auto">
          <Tag><span className="live-dot !h-1.5 !w-1.5" /> Disponible maintenant</Tag>
          <h3 className="mt-4 text-3xl font-extrabold">SOS</h3>
          <p className="mt-2 text-white/85">Une question urgente ? Un enseignant en 1:1, tout de suite.</p>
        </div>
      </Link>

      {/* 4. Cours en direct */}
      <Link
        href="/cours-en-direct"
        className="group relative flex min-h-[300px] flex-col overflow-hidden rounded-[2rem] bg-gradient-to-br from-teal-400 via-cyan-500 to-sky-600 p-7 text-white"
      >
        <div className="flex items-start justify-between">
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-white/15 ring-1 ring-white/25">
            <Radio className="h-7 w-7" />
          </span>
          <Arrow />
        </div>
        <div className="mt-auto">
          <Tag>100 % gratuit</Tag>
          <h3 className="mt-4 text-3xl font-extrabold">Cours en direct</h3>
          <p className="mt-2 text-white/85">Des cours de groupe programmés chaque jour de la semaine.</p>
        </div>
      </Link>

      {/* 2. Enfants */}
      <Link
        href="/enfants"
        className="group relative flex min-h-[300px] flex-col overflow-hidden rounded-[2rem] bg-gradient-to-br from-amber-300 via-amber-400 to-orange-400 p-7 text-ink"
      >
        <div className="flex items-start justify-between">
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-white/40 ring-1 ring-white/50">
            <Baby className="h-7 w-7" />
          </span>
          <Arrow />
        </div>
        <div className="mt-auto">
          <Tag dark>Comptes gérés par les parents</Tag>
          <h3 className="mt-4 text-3xl font-extrabold">Enfants</h3>
          <p className="mt-2 text-ink/75">Kodech, lecture, Paracha, Bar et Bat-Mitsva : des bases solides.</p>
        </div>
      </Link>

      {/* 3. Femmes (cachée aux hommes) — sinon Binôme */}
      {hideWomen ? (
        <Link
          href="/binome"
          className="group relative flex min-h-[300px] flex-col overflow-hidden rounded-[2rem] bg-gradient-to-br from-emerald-400 via-emerald-500 to-teal-600 p-7 text-white"
        >
          <div className="flex items-start justify-between">
            <span className="grid h-14 w-14 place-items-center rounded-2xl bg-white/15 ring-1 ring-white/25">
              <Users className="h-7 w-7" />
            </span>
            <Arrow />
          </div>
          <div className="mt-auto">
            <Tag>Gratuit · entre pairs</Tag>
            <h3 className="mt-4 text-3xl font-extrabold">Binôme</h3>
            <p className="mt-2 text-white/85">Trouvez votre partenaire d&apos;étude régulier.</p>
          </div>
        </Link>
      ) : (
        <Link
          href="/femmes"
          className="group relative flex min-h-[300px] flex-col overflow-hidden rounded-[2rem] bg-gradient-to-br from-pink-400 via-pink-500 to-fuchsia-600 p-7 text-white"
        >
          <div className="flex items-start justify-between">
            <span className="grid h-14 w-14 place-items-center rounded-2xl bg-white/15 ring-1 ring-white/25">
              <HeartHandshake className="h-7 w-7" />
            </span>
            <Arrow />
          </div>
          <div className="mt-auto">
            <Tag><Lock className="h-3 w-3" /> Réservé aux femmes</Tag>
            <h3 className="mt-4 text-3xl font-extrabold">Femmes</h3>
            <p className="mt-2 text-white/85">Apprendre entre femmes, avec des enseignantes qualifiées.</p>
          </div>
        </Link>
      )}
    </div>
  );
}
