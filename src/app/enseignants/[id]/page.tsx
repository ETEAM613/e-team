import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BadgeCheck, BookOpen, ChevronLeft, GraduationCap, Languages, MapPin, Star, Users } from "lucide-react";
import { getTeacher, TEACHERS } from "@/lib/data";
import Avatar from "@/components/Avatar";
import ProfileGate from "@/components/ProfileGate";
import { chip } from "@/components/ui";
import BookingWidget from "./BookingWidget";

// Toutes les fiches sont pré-générées : on accepte une navigation bloquante.
export const instant = false;

export function generateStaticParams() {
  return TEACHERS.map((t) => ({ id: t.id }));
}

// Titre neutre : le nom n'est pas exposé aux profils qui n'ont pas accès à la fiche
export const metadata: Metadata = { title: "Profil enseignant" };

const DEMO_REVIEWS = [
  { name: "Yonathan", date: "il y a 1 semaine", text: "Pédagogue, patient et toujours à l'heure. Je progresse vraiment chaque semaine." },
  { name: "Avraham", date: "il y a 3 semaines", text: "Des explications claires et une vraie chaleur humaine. Je recommande vivement." },
];

export default async function TeacherPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const t = getTeacher(id);
  if (!t) notFound();
  const kidsTeacher = t.accepts.includes("garcon") || t.accepts.includes("fille");

  return (
    <div className="container-page py-8">
      <Link href="/enseignants" className="inline-flex items-center gap-1 text-sm font-semibold text-muted hover:text-ink">
        <ChevronLeft className="h-4 w-4" /> Tous les enseignants
      </Link>

      <div className="mt-6">
        <ProfileGate hideFor={kidsTeacher ? [] : [t.gender === "homme" ? "femme" : "homme"]}>
          <div className="grid gap-10 lg:grid-cols-[1fr_420px]">
            <div className="min-w-0">
              <div className="flex flex-col gap-6 rounded-[2rem] border border-line bg-white p-6 sm:flex-row sm:p-8">
                <Avatar name={t.name} gradient={t.gradient} size={140} online={t.availableNow} />
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-3xl font-extrabold sm:text-4xl">{t.name}</h1>
                    {t.verified && <BadgeCheck className="h-7 w-7 text-brand-500" aria-label="Profil vérifié" />}
                  </div>
                  <p className="mt-1 font-medium text-muted">{t.title}</p>
                  {t.availableNow && (
                    <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-sm font-bold text-emerald-700">
                      <span className="live-dot" /> Disponible maintenant pour un SOS
                    </p>
                  )}
                  <p className="mt-4 text-xl font-bold">{t.headline}</p>
                  <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm">
                    <span className="flex items-center gap-1.5 font-bold">
                      <Star className="h-4 w-4 fill-amber-400 text-amber-400" /> {t.rating.toFixed(1).replace(".", ",")}
                      <span className="font-normal text-muted">({t.reviews} avis)</span>
                    </span>
                    <span className="flex items-center gap-1.5 text-muted"><Users className="h-4 w-4" /> {t.students} élèves</span>
                    <span className="flex items-center gap-1.5 text-muted"><BookOpen className="h-4 w-4" /> {t.lessons} cours</span>
                    <span className="flex items-center gap-1.5 text-muted"><MapPin className="h-4 w-4" /> {t.country}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <div className="rounded-3xl border border-line bg-white p-5">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted">Enseigne</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {t.subjects.map((s) => <span key={s} className={chip}>{s}</span>)}
                  </div>
                </div>
                <div className="rounded-3xl border border-line bg-white p-5">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted">Parle</p>
                  <p className="mt-2 flex items-center gap-1.5 text-sm font-semibold"><Languages className="h-4 w-4" /> {t.languages.join(", ")}</p>
                </div>
                <div className="rounded-3xl border border-line bg-white p-5">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted">Niveaux</p>
                  <p className="mt-2 flex items-center gap-1.5 text-sm font-semibold"><GraduationCap className="h-4 w-4" /> {t.levels.join(", ")}</p>
                </div>
              </div>

              <section className="mt-10">
                <h2 className="text-2xl font-extrabold">À propos</h2>
                <p className="mt-3 text-lg leading-relaxed text-ink/85">{t.bio}</p>
              </section>

              <section className="mt-10">
                <h2 className="text-2xl font-extrabold">Parcours vérifié</h2>
                <ul className="mt-4 space-y-3">
                  {t.experience.map((e) => (
                    <li key={e} className="flex items-start gap-3 rounded-2xl border border-line bg-white p-4">
                      <BadgeCheck className="mt-0.5 h-5 w-5 shrink-0 text-brand-500" />
                      <span className="font-semibold">{e}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <section className="mt-10">
                <h2 className="flex items-center gap-2 text-2xl font-extrabold">
                  <Star className="h-6 w-6 fill-amber-400 text-amber-400" /> {t.rating.toFixed(1).replace(".", ",")} · {t.reviews} avis
                </h2>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  {DEMO_REVIEWS.map((r) => (
                    <figure key={r.name} className="rounded-3xl border border-line bg-white p-5">
                      <div className="flex items-center justify-between">
                        <figcaption className="font-bold">{r.name}</figcaption>
                        <span className="text-xs text-muted">{r.date}</span>
                      </div>
                      <div className="mt-1 flex gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />)}
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
        </ProfileGate>
      </div>
    </div>
  );
}
