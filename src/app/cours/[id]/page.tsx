import type { Metadata } from "next";
import Link from "next/link";
import { CalendarDays, CheckCircle2, Clock, MessageCircle, Video, XCircle } from "lucide-react";
import { requireUser } from "@/lib/server/auth";
import { lessonForUser } from "@/lib/server/lessons";
import { cancelLesson } from "@/app/actions/lessons";
import Avatar from "@/components/Avatar";
import LocalTime from "@/components/LocalTime";
import Unavailable from "@/components/Unavailable";
import { nowMs } from "@/lib/server/clock";
import { btn } from "@/components/ui";

export const metadata: Metadata = { title: "Mon cours" };

export default async function LessonPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ reserve?: string }> }) {
  const { id } = await params;
  const { reserve } = await searchParams;
  const user = await requireUser(`/cours/${id}`);
  const l = await lessonForUser(id, user);
  if (!l) return <div className="container-page py-12"><Unavailable /></div>;

  const start = l.startsAt.getTime();
  const end = start + l.durationMin * 60000;
  const now = nowMs();
  const cancelled = l.status === "cancelled";
  const past = now > end;
  const canJoin = !cancelled && now >= start - 10 * 60000 && now <= end;
  const otherName = l.iAmTeacher ? (l.childName ? `${l.childName} (enfant de ${l.studentName})` : l.studentName) : l.teacherName;

  return (
    <div className="container-page max-w-3xl py-12">
      {reserve && !cancelled && (
        <p className="mb-6 flex items-center gap-2 rounded-2xl bg-emerald-50 p-4 font-bold text-emerald-700">
          <CheckCircle2 className="h-5 w-5" /> Cours réservé ! Un e-mail de confirmation vous a été envoyé.
        </p>
      )}

      <div className="overflow-hidden rounded-[2rem] border border-line bg-white">
        <div className="flex flex-wrap items-center gap-4 bg-gradient-to-br from-brand-500 to-indigo-700 p-6 text-white sm:p-8">
          <Avatar name={otherName} gradient={l.iAmTeacher ? "from-slate-400 to-slate-600" : l.teacherGradient} size={64} />
          <div className="flex-1">
            <p className="text-sm font-bold text-white/70">{l.iAmTeacher ? "Cours avec votre élève" : "Votre cours avec"}</p>
            <h1 className="text-3xl font-extrabold">{otherName}</h1>
          </div>
          {l.isTrial && <span className="rounded-full bg-white/20 px-3 py-1 text-sm font-bold">Cours d&apos;essai</span>}
        </div>

        <div className="space-y-3 p-6 sm:p-8">
          <p className="flex items-center gap-2 text-lg font-bold">
            <CalendarDays className="h-5 w-5 text-brand-500" /> <LocalTime iso={l.startsAt.toISOString()} />
          </p>
          <p className="flex items-center gap-2 text-muted">
            <Clock className="h-5 w-5" /> {l.durationMin === 30 ? "30 minutes" : "1 heure"}
            {l.subject ? ` · ${l.subject}` : ""}
          </p>

          {cancelled ? (
            <p className="flex items-center gap-2 rounded-2xl bg-rose-50 p-4 font-bold text-rose-700"><XCircle className="h-5 w-5" /> Ce cours a été annulé.</p>
          ) : past ? (
            <p className="rounded-2xl bg-surface p-4 font-semibold">Ce cours est terminé.</p>
          ) : canJoin ? (
            <div className="rounded-2xl bg-brand-50 p-5">
              <p className="font-extrabold text-brand-700">C&apos;est l&apos;heure de votre cours !</p>
              <p className="mt-1 text-sm text-muted">La salle vidéo intégrée au site arrive à la prochaine étape.</p>
              <button disabled className={`${btn.primary} mt-4`}>
                <Video className="h-5 w-5" /> Rejoindre le cours
              </button>
            </div>
          ) : (
            <div className="rounded-2xl bg-surface p-5">
              <p className="font-bold">La salle de cours ouvrira 10 minutes avant le début.</p>
              <p className="mt-1 text-sm text-muted">Revenez sur cette page à l&apos;heure du cours, ou depuis le lien reçu par e-mail.</p>
            </div>
          )}

          <div className="flex flex-wrap gap-3 pt-3">
            {!l.iAmTeacher && (
              <Link href={`/messages?to=${l.teacherSlug}`} className={btn.outline}>
                <MessageCircle className="h-4 w-4" /> Écrire à l&apos;enseignant
              </Link>
            )}
            <Link href={l.iAmTeacher ? "/espace-enseignant#cours" : "/mon-compte#cours"} className={btn.outline}>Tous mes cours</Link>
            {!cancelled && now < start && (
              <form action={cancelLesson.bind(null, l.id)}>
                <button className="rounded-full px-5 py-3 text-sm font-bold text-rose-600 hover:bg-rose-50">Annuler ce cours</button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
