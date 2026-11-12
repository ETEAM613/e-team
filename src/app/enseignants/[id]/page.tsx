import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Award, BookOpen, ChevronLeft, GraduationCap, Languages, MapPin, Star, Users } from "lucide-react";
import { getTeacher, SPACES, TEACHERS } from "@/lib/data";
import Avatar from "@/components/Avatar";
import BookingWidget from "./BookingWidget";

// Toutes les fiches sont pré-générées : on accepte une navigation bloquante.
export const instant = false;

export function generateStaticParams() {
  return TEACHERS.map((t) => ({ id: t.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const t = getTeacher(id);
  return { title: t ? `${t.name} — ${t.subjects.join(", ")}` : "Enseignant" };
}

const DEMO_REVIEWS = [
  { name: "Yonathan", date: "il y a 1 semaine", text: "Pédagogue, patient et toujours à l'heure. Je progresse vraiment chaque semaine." },
  { name: "Avraham", date: "il y a 3 semaines", text: "Des explications claires et une vraie chaleur humaine. Je recommande vivement." },
  { name: "Léa", date: "il y a 1 mois", text: "Le cours d'essai m'a tout de suite mise en confiance. Je continue avec plaisir !" },
];

export default async function TeacherPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const t = getTeacher(id);
  if (!t) notFound();

  const spaces = SPACES.filter((s) => t.spaces.includes(s.slug));

  return (
    <div className="container-page py-8">
      <Link href="/enseignants" className="inline-flex items-center gap-1 text-sm font-semibold text-muted hover:text-ink">
        <ChevronLeft className="h-4 w-4" /> Tous les enseignants
      </Link>

      <div className="mt-6 grid gap-10 lg:grid-cols-[1fr_400px]">
        <div className="min-w-0">
          {/* En-tête */}
          <div className="flex flex-col gap-6 sm:flex-row">
            <Avatar name={t.name} color={t.color} size={140} />
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">{t.name}</h1>
                {t.superTeacher && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-gold-100 px-2.5 py-1 text-xs font-bold text-gold-700">
                    <Award className="h-3.5 w-3.5" /> Enseignant recommandé
                  </span>
                )}
              </div>
              <p className="mt-1 font-medium text-muted">{t.title}</p>
              <p className="mt-3 text-xl font-bold">{t.headline}</p>
              <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm">
                <span className="flex items-center gap-1.5 font-bold">
                  <Star className="h-4 w-4 fill-gold-400 text-gold-400" /> {t.rating.toFixed(1).replace(".", ",")}
                  <span className="font-normal text-muted">({t.reviews} avis)</span>
                </span>
                <span className="flex items-center gap-1.5 text-muted"><Users className="h-4 w-4" /> {t.students} élèves</span>
                <span className="flex items-center gap-1.5 text-muted"><BookOpen className="h-4 w-4" /> {t.lessons} cours</span>
                <span className="flex items-center gap-1.5 text-muted"><MapPin className="h-4 w-4" /> {t.country}</span>
              </div>
            </div>
          </div>

          {/* Infos clés */}
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl bg-white p-4 ring-1 ring-line">
              <p className="text-xs font-bold uppercase text-muted">Enseigne</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {t.subjects.map((s) => (
                  <span key={s} className="rounded-md bg-navy-50 px-2 py-1 text-xs font-semibold text-navy-700">{s}</span>
                ))}
              </div>
            </div>
            <div className="rounded-2xl bg-white p-4 ring-1 ring-line">
              <p className="text-xs font-bold uppercase text-muted">Parle</p>
              <p className="mt-2 flex items-center gap-1.5 text-sm font-semibold"><Languages className="h-4 w-4" /> {t.languages.join(", ")}</p>
            </div>
            <div className="rounded-2xl bg-white p-4 ring-1 ring-line">
              <p className="text-xs font-bold uppercase text-muted">Niveaux</p>
              <p className="mt-2 flex items-center gap-1.5 text-sm font-semibold"><GraduationCap className="h-4 w-4" /> {t.levels.join(", ")}</p>
            </div>
          </div>

          {/* À propos */}
          <section className="mt-10">
            <h2 className="text-2xl font-extrabold">À propos</h2>
            <p className="mt-3 text-lg leading-relaxed text-ink/90">{t.bio}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {spaces.map((s) => (
                <Link key={s.slug} href={`/espaces/${s.slug}`} className="rounded-full border border-line bg-white px-3 py-1 text-sm font-semibold hover:border-ink">
                  {s.title}
                </Link>
              ))}
            </div>
          </section>

          <section className="mt-10">
            <h2 className="text-2xl font-extrabold">Parcours et expérience</h2>
            <ul className="mt-4 space-y-3">
              {t.experience.map((e) => (
                <li key={e} className="flex items-start gap-3 rounded-2xl bg-white p-4 ring-1 ring-line">
                  <GraduationCap className="mt-0.5 h-5 w-5 shrink-0 text-gold-500" />
                  <span className="font-semibold">{e}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Avis */}
          <section className="mt-10">
            <h2 className="flex items-center gap-2 text-2xl font-extrabold">
              <Star className="h-6 w-6 fill-gold-400 text-gold-400" /> {t.rating.toFixed(1).replace(".", ",")} · {t.reviews} avis
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {DEMO_REVIEWS.map((r) => (
                <figure key={r.name} className="rounded-2xl bg-white p-5 ring-1 ring-line">
                  <div className="flex items-center justify-between">
                    <figcaption className="font-bold">{r.name}</figcaption>
                    <span className="text-xs text-muted">{r.date}</span>
                  </div>
                  <div className="mt-1 flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-gold-400 text-gold-400" />
                    ))}
                  </div>
                  <blockquote className="mt-3 text-sm leading-relaxed">{r.text}</blockquote>
                </figure>
              ))}
            </div>
          </section>
        </div>

        <aside id="reserver" className="scroll-mt-24 lg:sticky lg:top-24 lg:self-start">
          <BookingWidget teacher={t} />
        </aside>
      </div>
    </div>
  );
}
