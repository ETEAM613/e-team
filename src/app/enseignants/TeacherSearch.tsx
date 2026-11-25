"use client";

import { useMemo, useState } from "react";
import { Search, SlidersHorizontal, Zap } from "lucide-react";
import { LANGUAGES, MOMENTS, SUBJECTS, type Gender, type Teacher } from "@/lib/data";
import TeacherCard from "@/components/TeacherCard";
import { input } from "@/components/ui";

const SORTS = [
  { value: "pertinence", label: "Les plus recommandés" },
  { value: "note", label: "Meilleures notes" },
  { value: "avis", label: "Nombre d'avis" },
  { value: "experience", label: "Plus d'expérience" },
];

const LEVELS = ["Débutant", "Intermédiaire", "Avancé"];

// Filtre « Cours pour » : visible seulement avant l'inscription.
// Une fois inscrit, le genre du compte filtre automatiquement tout le site.
const PUBLICS = [
  { value: "", label: "Tous" },
  { value: "hommes", label: "Hommes" },
  { value: "femmes", label: "Femmes" },
  { value: "enfants", label: "Enfants" },
];

export default function TeacherSearch({
  teachers,
  gender,
  initialSubject,
  initialPublic,
}: {
  teachers: Teacher[];
  gender: Gender | null;
  initialSubject: string;
  initialPublic: string;
}) {
  const [subject, setSubject] = useState(initialSubject);
  const [level, setLevel] = useState("");
  const [moment, setMoment] = useState("");
  const [language, setLanguage] = useState("");
  const [pub, setPub] = useState(PUBLICS.some((p) => p.value === initialPublic) ? initialPublic : "");
  const [nowOnly, setNowOnly] = useState(false);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("pertinence");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    // La liste reçue est déjà triée par le serveur selon le compte connecté.
    const list = teachers.filter(
      (t) =>
        (gender ||
          !pub ||
          (pub === "hommes" && t.gender === "homme" && t.accepts.includes("homme")) ||
          (pub === "femmes" && t.gender === "femme" && t.accepts.includes("femme")) ||
          (pub === "enfants" && (t.accepts.includes("garcon") || t.accepts.includes("fille")))) &&
        (!subject || t.subjects.includes(subject)) &&
        (!level || t.levels.includes(level)) &&
        (!moment || t.available.includes(moment as never)) &&
        (!language || t.languages.includes(language)) &&
        (!nowOnly || t.availableNow) &&
        (!q || `${t.name} ${t.headline} ${t.bio} ${t.subjects.join(" ")}`.toLowerCase().includes(q)),
    );
    const sorted = [...list];
    if (sort === "note") sorted.sort((a, b) => b.rating - a.rating);
    else if (sort === "avis") sorted.sort((a, b) => b.reviews - a.reviews);
    else if (sort === "experience") sorted.sort((a, b) => b.lessons - a.lessons);
    else sorted.sort((a, b) => b.rating * Math.log(b.reviews) - a.rating * Math.log(a.reviews));
    return sorted;
  }, [teachers, gender, pub, subject, level, moment, language, nowOnly, query, sort]);

  const reset = () => {
    setSubject("");
    setLevel("");
    setMoment("");
    setLanguage("");
    setPub("");
    setNowOnly(false);
    setQuery("");
  };

  const selectCls = `${input} !py-2.5 font-semibold`;

  return (
    <>
      {/* Filtres */}
      <div className="z-30 rounded-3xl border border-line bg-white/90 p-4 backdrop-blur-xl sm:px-5 lg:sticky lg:top-[72px]">
        <div className={`grid grid-cols-2 gap-3 ${gender ? "lg:grid-cols-4" : "lg:grid-cols-5"}`}>
          {!gender && (
            <label className="block">
              <span className="mb-1 block text-xs font-bold text-muted">Cours pour</span>
              <select className={selectCls} value={pub} onChange={(e) => setPub(e.target.value)}>
                {PUBLICS.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
              </select>
            </label>
          )}
          <label className="block">
            <span className="mb-1 block text-xs font-bold text-muted">Matière</span>
            <select className={selectCls} value={subject} onChange={(e) => setSubject(e.target.value)}>
              <option value="">Toutes</option>
              {SUBJECTS.map((s) => <option key={s}>{s}</option>)}
            </select>
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-bold text-muted">Niveau</span>
            <select className={selectCls} value={level} onChange={(e) => setLevel(e.target.value)}>
              <option value="">Tous</option>
              {LEVELS.map((l) => <option key={l}>{l}</option>)}
            </select>
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-bold text-muted">Horaires</span>
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
        </div>
        <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center">
          <span className="relative block flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher un nom, un sujet…"
              aria-label="Rechercher"
              className={`${selectCls} !pl-10`}
            />
          </span>
          <button
            type="button"
            onClick={() => setNowOnly((v) => !v)}
            className={`inline-flex shrink-0 items-center justify-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-bold transition ${
              nowOnly ? "bg-rose-500 text-white" : "bg-rose-50 text-rose-600 hover:bg-rose-100"
            }`}
          >
            <Zap className="h-4 w-4" /> Répond aux SOS
          </button>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <p className="font-display text-lg font-extrabold">
          {results.length} enseignant{results.length > 1 ? "s" : ""}
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
