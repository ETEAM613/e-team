"use client";

import { useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { LANGUAGES, SPACES, SUBJECTS, TEACHERS } from "@/lib/data";
import TeacherCard from "@/components/TeacherCard";

const MOMENTS = [
  { value: "matin", label: "Matin" },
  { value: "apres-midi", label: "Après-midi" },
  { value: "soir", label: "Soir" },
] as const;

const SORTS = [
  { value: "pertinence", label: "Les plus recommandés" },
  { value: "note", label: "Meilleures notes" },
  { value: "prix-asc", label: "Prix croissant" },
  { value: "prix-desc", label: "Prix décroissant" },
  { value: "avis", label: "Nombre d'avis" },
];

const selectCls =
  "w-full rounded-xl border-2 border-line bg-white px-3 py-2.5 font-semibold text-ink outline-none transition focus:border-ink";

export default function TeacherSearch({
  initialSubject,
  initialSpace,
}: {
  initialSubject: string;
  initialSpace: string;
}) {
  const [subject, setSubject] = useState(initialSubject);
  const [space, setSpace] = useState(initialSpace);
  const [language, setLanguage] = useState("");
  const [moment, setMoment] = useState("");
  const [maxPrice, setMaxPrice] = useState(50);
  const [freeTrial, setFreeTrial] = useState(false);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("pertinence");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = TEACHERS.filter(
      (t) =>
        (!subject || t.subjects.includes(subject)) &&
        (!space || t.spaces.includes(space as never)) &&
        (!language || t.languages.includes(language)) &&
        (!moment || t.available.includes(moment as never)) &&
        t.price <= maxPrice &&
        (!freeTrial || t.trialPrice === 0) &&
        (!q || `${t.name} ${t.headline} ${t.bio} ${t.subjects.join(" ")}`.toLowerCase().includes(q)),
    );
    const sorted = [...list];
    switch (sort) {
      case "note":
        sorted.sort((a, b) => b.rating - a.rating);
        break;
      case "prix-asc":
        sorted.sort((a, b) => a.price - b.price);
        break;
      case "prix-desc":
        sorted.sort((a, b) => b.price - a.price);
        break;
      case "avis":
        sorted.sort((a, b) => b.reviews - a.reviews);
        break;
      default:
        sorted.sort((a, b) => Number(!!b.superTeacher) - Number(!!a.superTeacher) || b.rating - a.rating);
    }
    return sorted;
  }, [subject, space, language, moment, maxPrice, freeTrial, query, sort]);

  const reset = () => {
    setSubject("");
    setSpace("");
    setLanguage("");
    setMoment("");
    setMaxPrice(50);
    setFreeTrial(false);
    setQuery("");
  };

  return (
    <>
      {/* Filtres */}
      <div className="sticky top-16 z-30 -mx-4 mt-6 border-y border-line bg-cream/95 px-4 py-4 backdrop-blur sm:mx-0 sm:rounded-2xl sm:border sm:px-5">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <label className="block">
            <span className="mb-1 block text-xs font-bold text-muted">Matière</span>
            <select className={selectCls} value={subject} onChange={(e) => setSubject(e.target.value)}>
              <option value="">Toutes</option>
              {SUBJECTS.map((s) => <option key={s}>{s}</option>)}
            </select>
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-bold text-muted">Espace</span>
            <select className={selectCls} value={space} onChange={(e) => setSpace(e.target.value)}>
              <option value="">Tous</option>
              {SPACES.map((s) => <option key={s.slug} value={s.slug}>{s.title}</option>)}
            </select>
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-bold text-muted">Langue</span>
            <select className={selectCls} value={language} onChange={(e) => setLanguage(e.target.value)}>
              <option value="">Toutes</option>
              {LANGUAGES.map((l) => <option key={l}>{l}</option>)}
            </select>
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-bold text-muted">Disponibilité</span>
            <select className={selectCls} value={moment} onChange={(e) => setMoment(e.target.value)}>
              <option value="">Peu importe</option>
              {MOMENTS.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
            </select>
          </label>
          <label className="block">
            <span className="mb-1 flex justify-between text-xs font-bold text-muted">
              Prix max <span className="text-ink">{maxPrice} €</span>
            </span>
            <input
              type="range"
              min={15}
              max={50}
              step={1}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="mt-3 w-full accent-[var(--color-ink)]"
            />
          </label>
        </div>
        <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher un nom, un sujet, un mot-clé…"
              className={`${selectCls} pl-10`}
            />
          </div>
          <label className="flex items-center gap-2 text-sm font-semibold">
            <input type="checkbox" checked={freeTrial} onChange={(e) => setFreeTrial(e.target.checked)} className="h-4 w-4 accent-[var(--color-ink)]" />
            Essai gratuit
          </label>
        </div>
      </div>

      {/* Résultats */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <p className="font-bold">
          {results.length} enseignant{results.length > 1 ? "s" : ""} disponible{results.length > 1 ? "s" : ""}
        </p>
        <label className="flex items-center gap-2 text-sm">
          <SlidersHorizontal className="h-4 w-4" />
          <select value={sort} onChange={(e) => setSort(e.target.value)} className="rounded-lg border border-line bg-white px-2 py-1.5 font-semibold">
            {SORTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </label>
      </div>

      <div className="mt-4 space-y-4">
        {results.map((t) => <TeacherCard key={t.id} teacher={t} />)}
        {results.length === 0 && (
          <div className="rounded-2xl border-2 border-dashed border-line p-10 text-center">
            <p className="text-lg font-bold">Aucun enseignant ne correspond à ces critères.</p>
            <button onClick={reset} className="mt-4 rounded-lg bg-ink px-5 py-2.5 font-bold text-white">
              Réinitialiser les filtres
            </button>
          </div>
        )}
      </div>

      <p className="mt-8 text-center text-xs text-muted">
        Profils de démonstration — ils seront remplacés par les vrais enseignants inscrits sur la plateforme.
      </p>
    </>
  );
}
