import type { Metadata } from "next";
import Link from "next/link";
import { CalendarDays, CheckCircle2, Clock, MessageCircle, Phone, Video, XCircle } from "lucide-react";
import { requireUser } from "@/lib/server/auth";
import { execute } from "@/lib/server/db";
import { lessonForUser, lessonState, type Outcome } from "@/lib/server/lessons";
import { dailyEnabled, ensureRoom, meetingToken, videoMinutes } from "@/lib/server/daily";
import { cancelLesson } from "@/app/actions/lessons";
import Avatar from "@/components/Avatar";
import LocalTime from "@/components/LocalTime";
import Unavailable from "@/components/Unavailable";
import { nowMs } from "@/lib/server/clock";
import { btn } from "@/components/ui";
import type { CallMode } from "@/lib/data";
import StartPanel from "./StartPanel";
import ReportForm from "./ReportForm";

export const metadata: Metadata = { title: "Mon cours" };

const OUTCOME_LABEL: Record<Outcome, string> = {
  done: "Le cours a eu lieu",
  early: "Terminé en avance",
  student_absent: "Élève absent",
  teacher_absent: "Enseignant absent",
};

export default async function LessonPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ reserve?: string; salle?: string }>;
}) {
  const { id } = await params;
  const { reserve, salle } = await searchParams;
  const user = await requireUser(`/cours/${id}`);
  const l = await lessonForUser(id, user);
  if (!l) return <div className="container-page py-12"><Unavailable /></div>;

  const now = nowMs();
  const start = l.startsAt.getTime();
  const end = start + l.durationMin * 60000;
  const cancelled = l.status === "cancelled";
  const open = !cancelled && now >= start - 10 * 60000 && now <= end + 30 * 60000;
  const participant = l.iAmTeacher || l.iAmStudent;
  const otherName = l.iAmTeacher ? (l.childName ? `${l.childName} (enfant de ${l.studentName})` : l.studentName) : l.teacherName;

  // Durée vidéo réelle, récupérée automatiquement auprès de Daily après le cours
  if (l.mode === "video" && l.dailyRoom && l.videoMinutes == null && now > end && dailyEnabled()) {
    try {
      const minutes = await videoMinutes(l.dailyRoom);
      if (minutes != null) {
        await execute("UPDATE lessons SET video_minutes = ? WHERE id = ?", [minutes, l.id]);
        l.videoMinutes = minutes;
      }
    } catch (err) {
      console.error("[e-team] durée Daily indisponible :", err);
    }
  }

  // Salle vidéo intégrée
  let room: { url: string; token: string } | null = null;
  if (salle && open && participant && dailyEnabled()) {
    const r = await ensureRoom(l.id, l.startsAt, l.durationMin);
    if (!l.dailyRoom) await execute("UPDATE lessons SET daily_room = ?, mode = 'video', started_at = COALESCE(started_at, UTC_TIMESTAMP()) WHERE id = ?", [r.name, l.id]);
    const token = await meetingToken(r.name, `${user.firstName} ${user.lastName}`, l.iAmTeacher, new Date(end + 30 * 60000));
    room = { url: r.url, token };
  }

  const state = lessonState(l, now);
  const myOutcome = l.iAmTeacher ? l.teacherOutcome : l.studentOutcome;
  const modes = (l.callModes.length ? l.callModes : (["video"] as CallMode[])).filter((m) => m !== "video" || dailyEnabled());
  const studentModes = modes;
  const teacherModes = modes.filter((m) => m === "video");
  const defaultMinutes = l.startedAt ? Math.max(1, Math.min(l.durationMin, Math.round((now - l.startedAt.getTime()) / 60000))) : l.durationMin;

  return (
    <div className={`container-page py-10 ${room ? "max-w-6xl" : "max-w-3xl"}`}>
      {reserve && !cancelled && (
        <p className="mb-6 flex items-center gap-2 rounded-2xl bg-emerald-50 p-4 font-bold text-emerald-700">
          <CheckCircle2 className="h-5 w-5" /> Cours réservé ! Un e-mail de confirmation vous a été envoyé.
        </p>
      )}

      {room && (
        <div className="mb-6 overflow-hidden rounded-[2rem] border border-line bg-ink">
          <iframe
            src={`${room.url}?t=${room.token}`}
            allow="camera; microphone; fullscreen; display-capture; autoplay"
            className="h-[72vh] min-h-[480px] w-full"
            title="Salle de cours e-team"
          />
        </div>
      )}

      <div className="overflow-hidden rounded-[2rem] border border-line bg-white">
        <div className="flex flex-wrap items-center gap-4 bg-gradient-to-br from-brand-500 to-indigo-700 p-6 text-white sm:p-8">
          <Avatar name={otherName} gradient={l.iAmTeacher ? "from-slate-400 to-slate-600" : l.teacherGradient} size={64} />
          <div className="flex-1">
            <p className="text-sm font-bold text-white/70">{l.iAmTeacher ? "Cours avec votre élève" : "Votre cours avec"}</p>
            <h1 className="text-3xl font-extrabold">{otherName}</h1>
          </div>
          <span className={`rounded-full px-3 py-1 text-sm font-bold ${state.tone}`}>{state.label}</span>
        </div>

        <div className="space-y-4 p-6 sm:p-8">
          <div className="space-y-1">
            <p className="flex items-center gap-2 text-lg font-bold">
              <CalendarDays className="h-5 w-5 text-brand-500" /> <LocalTime iso={l.startsAt.toISOString()} />
            </p>
            <p className="flex items-center gap-2 text-muted">
              <Clock className="h-5 w-5" /> {l.durationMin === 30 ? "30 minutes" : "1 heure"}
              {l.subject ? ` · ${l.subject}` : ""}
              {l.isTrial ? " · cours d'essai" : ""}
            </p>
            {l.mode && (
              <p className="flex items-center gap-2 text-muted">
                {l.mode === "video" ? <Video className="h-5 w-5" /> : <Phone className="h-5 w-5" />}
                {l.mode === "video" ? "Vidéo sur e-team" : l.mode === "whatsapp" ? "Appel WhatsApp" : "Appel téléphonique"}
                {l.mode === "video" && l.videoMinutes != null ? ` · ${l.videoMinutes} min ensemble en vidéo` : ""}
              </p>
            )}
          </div>

          {cancelled ? (
            <p className="flex items-center gap-2 rounded-2xl bg-rose-50 p-4 font-bold text-rose-700"><XCircle className="h-5 w-5" /> Ce cours a été annulé.</p>
          ) : (
            <>
              {/* Démarrer */}
              {open && participant && !myOutcome && !room && (
                <div className="rounded-2xl bg-brand-50 p-5">
                  {l.iAmTeacher && l.mode && l.mode !== "video" ? (
                    <p className="font-bold text-brand-700">
                      L&apos;élève a choisi : {l.mode === "whatsapp" ? "appel WhatsApp" : "appel téléphonique"}. Il va vous appeler.
                    </p>
                  ) : (l.iAmTeacher ? teacherModes : studentModes).length > 0 ? (
                    <StartPanel lessonId={l.id} modes={l.iAmTeacher ? teacherModes : studentModes} />
                  ) : (
                    <p className="font-bold text-brand-700">L&apos;élève va lancer le cours (WhatsApp ou téléphone).</p>
                  )}
                </div>
              )}
              {!open && now < start && (
                <div className="rounded-2xl bg-surface p-5">
                  <p className="font-bold">Le cours ouvrira 10 minutes avant le début.</p>
                  <p className="mt-1 text-sm text-muted">Revenez sur cette page à l&apos;heure du cours, ou depuis le lien reçu par e-mail.</p>
                </div>
              )}

              {/* Fin du cours */}
              {participant && now >= start && (
                myOutcome ? (
                  <p className="rounded-2xl bg-emerald-50 p-4 text-sm font-semibold text-emerald-700">
                    Vous avez indiqué : {OUTCOME_LABEL[myOutcome]}
                    {(l.iAmTeacher ? l.teacherMinutes : l.studentMinutes) ? ` (${l.iAmTeacher ? l.teacherMinutes : l.studentMinutes} min)` : ""}.
                  </p>
                ) : (
                  <ReportForm lessonId={l.id} iAmTeacher={l.iAmTeacher} defaultMinutes={defaultMinutes} />
                )
              )}
            </>
          )}

          <div className="flex flex-wrap gap-3 pt-2">
            {!l.iAmTeacher && (
              <Link href={`/messages?to=${l.teacherSlug}`} className={btn.outline}>
                <MessageCircle className="h-4 w-4" /> Écrire à l&apos;enseignant
              </Link>
            )}
            <Link href={l.iAmTeacher ? "/espace-enseignant#cours" : "/mon-compte#cours"} className={btn.outline}>Tous mes cours</Link>
            {!cancelled && now < start && participant && (
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
