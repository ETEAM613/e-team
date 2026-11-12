import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { getSpace, SPACES, TEACHERS } from "@/lib/data";
import TeacherCard from "@/components/TeacherCard";

export const instant = false;

export function generateStaticParams() {
  return SPACES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  return { title: getSpace(slug)?.title ?? "Espace" };
}

const HERO: Record<string, string> = {
  hommes: "bg-navy-700 text-white",
  femmes: "bg-gold-300 text-ink",
  enfants: "bg-[#f4c9b3] text-ink",
};

export default async function SpacePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const space = getSpace(slug);
  if (!space) notFound();

  const teachers = TEACHERS.filter((t) => t.spaces.includes(space.slug));
  const dark = space.slug === "hommes";

  return (
    <>
      <section className={HERO[space.slug]}>
        <div className="container-page grid gap-10 py-16 lg:grid-cols-[1.3fr_1fr] lg:items-center">
          <div>
            <p className={`text-sm font-bold uppercase tracking-wider ${dark ? "text-gold-300" : "text-ink/70"}`}>{space.title}</p>
            <h1 className="mt-3 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">{space.tagline}</h1>
            <p className={`mt-5 max-w-xl text-lg ${dark ? "text-navy-100" : "text-ink/80"}`}>{space.description}</p>
            <Link
              href={`/enseignants?espace=${space.slug}`}
              className={`mt-8 inline-flex items-center gap-2 rounded-xl px-6 py-3.5 font-bold ${
                dark ? "bg-gold-400 text-ink hover:bg-gold-300" : "bg-ink text-white hover:bg-navy-700"
              }`}
            >
              Voir les enseignants <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
          <ul className={`space-y-3 rounded-3xl p-6 ${dark ? "bg-white/10" : "bg-white/60"}`}>
            {space.points.map((p) => (
              <li key={p} className="flex gap-3 font-semibold">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" /> {p}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="container-page py-14">
        <h2 className="text-2xl font-extrabold">Matières proposées</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {space.subjects.map((s) => (
            <Link
              key={s}
              href={`/enseignants?espace=${space.slug}&matiere=${encodeURIComponent(s)}`}
              className="rounded-full border-2 border-line bg-white px-4 py-2 font-semibold transition hover:border-ink"
            >
              {s}
            </Link>
          ))}
        </div>

        <h2 className="mt-14 text-2xl font-extrabold">Enseignants de cet espace</h2>
        <div className="mt-4 space-y-4">
          {teachers.map((t) => (
            <TeacherCard key={t.id} teacher={t} />
          ))}
        </div>
      </section>
    </>
  );
}
