import Link from "next/link";
import { Star, Users, BookOpen, Languages, Award } from "lucide-react";
import type { Teacher } from "@/lib/data";
import Avatar from "./Avatar";

export default function TeacherCard({ teacher: t }: { teacher: Teacher }) {
  return (
    <article className="group rounded-2xl border border-line bg-white p-5 transition hover:border-ink hover:shadow-[4px_4px_0_0_var(--color-ink)] sm:p-6">
      <div className="flex flex-col gap-5 sm:flex-row">
        <Link href={`/enseignants/${t.id}`} className="shrink-0">
          <Avatar name={t.name} color={t.color} size={112} />
        </Link>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <Link href={`/enseignants/${t.id}`} className="text-xl font-extrabold text-ink hover:underline">
              {t.name}
            </Link>
            {t.superTeacher && (
              <span className="inline-flex items-center gap-1 rounded-full bg-gold-100 px-2 py-0.5 text-xs font-bold text-gold-700">
                <Award className="h-3.5 w-3.5" /> Enseignant recommandé
              </span>
            )}
          </div>
          <p className="mt-0.5 text-sm font-medium text-muted">{t.title} · {t.country}</p>

          <div className="mt-3 flex flex-wrap gap-1.5">
            {t.subjects.map((s) => (
              <span key={s} className="rounded-md bg-navy-50 px-2 py-1 text-xs font-semibold text-navy-700">
                {s}
              </span>
            ))}
          </div>

          <p className="mt-3 font-bold text-ink">{t.headline}</p>
          <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-muted">{t.bio}</p>

          <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted">
            <li className="flex items-center gap-1.5"><Users className="h-4 w-4" /> {t.students} élèves actifs</li>
            <li className="flex items-center gap-1.5"><BookOpen className="h-4 w-4" /> {t.lessons} cours donnés</li>
            <li className="flex items-center gap-1.5"><Languages className="h-4 w-4" /> {t.languages.join(", ")}</li>
          </ul>
        </div>

        <div className="flex shrink-0 flex-row items-end justify-between gap-4 border-t border-line pt-4 sm:w-48 sm:flex-col sm:items-stretch sm:border-l sm:border-t-0 sm:pl-5 sm:pt-0">
          <div className="flex gap-6 sm:justify-between">
            <div>
              <p className="flex items-center gap-1 text-lg font-extrabold">
                <Star className="h-4 w-4 fill-gold-400 text-gold-400" /> {t.rating.toFixed(1).replace(".", ",")}
              </p>
              <p className="text-xs text-muted">{t.reviews} avis</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-extrabold">{t.price} €</p>
              <p className="text-xs text-muted">cours de 50 min</p>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Link
              href={`/enseignants/${t.id}#reserver`}
              className="rounded-lg bg-gold-400 px-4 py-2.5 text-center text-sm font-bold text-ink transition hover:bg-gold-300"
            >
              {t.trialPrice === 0 ? "Essai gratuit" : `Essai · ${t.trialPrice} €`}
            </Link>
            <Link
              href={`/messages?to=${t.id}`}
              className="rounded-lg border-2 border-line px-4 py-2 text-center text-sm font-bold text-ink transition hover:border-ink"
            >
              Envoyer un message
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
