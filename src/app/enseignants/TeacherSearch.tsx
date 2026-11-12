"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, ShieldCheck, SlidersHorizontal, Zap } from "lucide-react";
import { AUDIENCES, LANGUAGES, MOMENTS, SUBJECTS, teachersFor, type Audience } from "@/lib/data";
import { setAudience, useAudience } from "@/lib/audience";
import TeacherCard from "@/components/TeacherCard";
import AudiencePicker, { AudienceSwitch } from "@/components/AudiencePicker";
import { input } from "@/components/ui";

const SORTS = [
  { value: "pertinence", label: "Les plus recommandés" },
  { value: "note", label: "Meilleures notes" },
  { value: "avis", label: "Nombre d'avis" },
  { value: "experience", label: "Plus d'expérience" },
];

export default function TeacherSearch({
  initialSubject,
  initialAudience,
}: {
  initialSubject: string;
  initialAudience: string;
}) {
  const audience = useAudience();
  const [subject, setSubject] = useState(initialSubject);
  const [language, setLanguage] = useState("");
  const [moment, setMoment] = useState("");
  const [nowOnly, setNowOnly] = useState(false);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("pertinence");

  // Le choix « Pour qui ? » fait depuis l'accueil est appliqué ici
  useEffect(() => {
    if (AUDIENCES.some((a) => a.value === initialAudience)) setAudience(initialAudience as Audience);
  }, [initialAudience]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = teachersFor(audience).filter(
      (t) =>
        (!subject || t.subjects.includes(subject)) &&
        (!language || t.languages.includes(language)) &&
        (!moment || t.available.includes(moment as never)) &&
        (!nowOnly || t.availableNow) &&
        (!q || `${t.name} ${t.headline} ${t.bio} ${t.subjects.join(" ")}`.toLowerCase().includes(q)),
    );
    const sorted = [...list];
    if (sort === "note") sorted.sort((a, b) => b.rating - a.rating);
    else if (sort === "avis") sorted.sort((a, b) => b.reviews - a.reviews);
    else if (sort === "experience") sorted.sort((a, b) => b.lessons - a.lessons);
    else sorted.sort((a, b) => b.rating * Math.log(b.reviews) - a.rating * Math.log(a.reviews));
    return sorted;
  }, [audience, subject, language, moment, nowOnly, query, sort]);

  if (!audience) return <AudiencePicker />;

  const reset = () => {
    setSubject("");
    setLanguage("");
    setMoment("");
    setNowOnly(false);
    setQuery("");
  };

  const selectCls = `${input} !py-2.5 font-semibold`;

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <AudienceSwitch />
        <p className="flex items-center gap-1.5 text-sm text-muted">
          <ShieldCheck className="h-4 w-4 text-brand-500" /> Séparation stricte hommes / femmes
        </p>
      </div>

      {/* Filtres visuels : matières / disponibilités / public / langue */}
      <div className="z-30 mt-4 rounded-3xl border border-line bg-white/90 p-4 backdrop-blur-xl sm:px-5 lg:sticky lg:top-[72px]">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-[1fr_1fr_1fr_1.4fr]">
          <label className="block">
            <span className="mb-1 block text-xs font-bold text-muted">Matière</span>
            <select className={selectCls} value={subject} onChange={(e) => setSubject(e.target.value)}>
              <option value="">Toutes</option>
              {SUBJECTS.map((s) => <option key={s}>{s}</option>)}
            </select>
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-bold text-muted">Disponibilités</span>
            <select className={selectCls} value={moment} onChange={(e) => setMoment(e.target.value)}>
              <option value="">Peu importe</option>
              {MOMENTS.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
            </select>
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-bold text-muted">Langue</span>
            <select className={selectCls} value={language} onChange={(e) => setLanguage(e.target.value)}>
              <option value="">Toutes</option>
              {LANGUAGES.map((l) => <option key={l}>{l}</option>)}
            </select>
          </label>
          <label className="col-span-2 block lg:col-span-1">
            <span className="mb-1 block text-xs font-bold text-muted">Recherche</span>
            <span className="relative block">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Nom, sujet, mot-clé…"
                className={`${selectCls} !pl-10`}
              />
            </span>
          </label>
        </div>
        <div className="-mx-4 mt-3 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0 [&>button]:shrink-0">
          <button
            type="button"
            onClick={() => setNowOnly((v) => !v)}
            className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-bold transition ${
              nowOnly ? "bg-rose-500 text-white" : "bg-rose-50 text-rose-600 hover:bg-rose-100"
            }`}
          >
            <Zap className="h-4 w-4" /> Disponible maintenant
          </button>
          {SUBJECTS.slice(0, 6).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSubject((cur) => (cur === s ? "" : s))}
              className={`rounded-full px-3.5 py-1.5 text-sm font-bold transition ${
                subject === s ? "bg-brand-500 text-white" : "bg-brand-50 text-brand-700 hover:bg-brand-100"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <p className="font-display text-lg font-extrabold">
          {results.length} enseignant{results.length > 1 ? "s" : ""} pour vous
        </p>
        <label className="flex items-center gap-2 text-sm">
          <SlidersHorizontal className="h-4 w-4" />
          <select value={sort} onChange={(e) => setSort(e.target.value)} className="rounded-full border border-line bg-white px-3 py-1.5 font-semibold">
            {SORTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </label>
      </div>

      <div className="mt-4 space-y-4">
        {results.map((t) => <TeacherCard key={t.id} teacher={t} />)}
        {results.length === 0 && (
          <div className="rounded-3xl border-2 border-dashed border-line bg-white p-12 text-center">
            <p className="text-lg font-bold">Aucun enseignant ne correspond à ces critères.</p>
            <button onClick={reset} className="mt-4 rounded-full bg-ink px-5 py-2.5 font-bold text-white">
              Réinitialiser les filtres
            </button>
          </div>
        )}
      </div>

      <p className="mt-8 text-center text-xs text-muted">
        Profils de démonstration — ils seront remplacés par les vrais enseignants vérifiés.
      </p>
    </>
  );
}
