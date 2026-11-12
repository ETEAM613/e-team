import Link from "next/link";
import { Star, Users, BookOpen, Languages, BadgeCheck, Zap } from "lucide-react";
import type { Teacher } from "@/lib/data";
import Avatar from "./Avatar";
import { btn, chip } from "./ui";

export default function TeacherCard({ teacher: t }: { teacher: Teacher }) {
  return (
    <article className="group rounded-3xl border border-line bg-white p-5 transition duration-300 hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-xl hover:shadow-brand-500/10 sm:p-6">
      <div className="flex flex-col gap-5 sm:flex-row">
        <Link href={`/enseignants/${t.id}`} className="shrink-0">
          <Avatar name={t.name} gradient={t.gradient} size={112} online={t.availableNow} />
        </Link>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <Link href={`/enseignants/${t.id}`} className="font-display text-xl font-extrabold text-ink hover:text-brand-600">
              {t.name}
            </Link>
            {t.verified && <BadgeCheck className="h-5 w-5 text-brand-500" aria-label="Profil vérifié" />}
            {t.availableNow && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700">
                <span className="live-dot !h-1.5 !w-1.5" /> Disponible maintenant
              </span>
            )}
          </div>
          <p className="mt-0.5 text-sm font-medium text-muted">{t.title} · {t.country}</p>

          <div className="mt-3 flex flex-wrap gap-1.5">
            {t.subjects.map((s) => (
              <span key={s} className={chip}>{s}</span>
            ))}
          </div>

          <p className="mt-3 font-bold text-ink">{t.headline}</p>
          <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-muted">{t.bio}</p>

          <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted">
            <li className="flex items-center gap-1.5"><Users className="h-4 w-4" /> {t.students} élèves</li>
            <li className="flex items-center gap-1.5"><BookOpen className="h-4 w-4" /> {t.lessons} cours</li>
            <li className="flex items-center gap-1.5"><Languages className="h-4 w-4" /> {t.languages.join(", ")}</li>
          </ul>
        </div>

        <div className="flex shrink-0 flex-col justify-between gap-4 border-t border-line pt-4 sm:w-52 sm:border-l sm:border-t-0 sm:pl-5 sm:pt-0">
          <div>
            <p className="flex items-center gap-1.5 text-2xl font-extrabold">
              <Star className="h-5 w-5 fill-amber-400 text-amber-400" /> {t.rating.toFixed(1).replace(".", ",")}
            </p>
            <p className="text-xs text-muted">{t.reviews} avis d&apos;élèves</p>
          </div>
          <div className="flex flex-col gap-2">
            <Link href={`/enseignants/${t.id}#reserver`} className={`${btn.primary} !py-2.5 text-sm`}>
              Premier cours gratuit
            </Link>
            {t.availableNow ? (
              <Link href="/sos" className={`${btn.outline} !py-2 text-sm`}>
                <Zap className="h-4 w-4 text-rose-500" /> SOS maintenant
              </Link>
            ) : (
              <Link href={`/messages?to=${t.id}`} className={`${btn.outline} !py-2 text-sm`}>
                Envoyer un message
              </Link>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
