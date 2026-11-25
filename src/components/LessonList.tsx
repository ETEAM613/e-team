import Link from "next/link";
import { CalendarDays, Video } from "lucide-react";
import { lessonState, type LessonItem } from "@/lib/server/lessons";
import Avatar from "./Avatar";
import LocalTime from "./LocalTime";
import { nowMs } from "@/lib/server/clock";

/** Liste de cours (vue élève ou enseignant). */
export default function LessonList({ lessons, as, empty }: { lessons: LessonItem[]; as: "student" | "teacher"; empty: React.ReactNode }) {
  const now = nowMs();
  return <List lessons={lessons} as={as} empty={empty} now={now} />;
}

function List({ lessons, as, empty, now }: { lessons: LessonItem[]; as: "student" | "teacher"; empty: React.ReactNode; now: number }) {
  if (lessons.length === 0) return <div className="rounded-2xl border border-dashed border-line p-6 text-center text-muted">{empty}</div>;
  return (
    <ul className="space-y-3">
      {lessons.map((l) => {
        const name = as === "student" ? l.teacherName : l.childName ? `${l.childName} (enfant de ${l.studentName})` : l.studentName;
        const st = lessonState(l, now);
        const soon = st.key === "scheduled" && l.startsAt.getTime() - now < 15 * 60000;
        const needsAction = st.key === "to_confirm" || st.key === "live";
        return (
          <li key={l.id}>
            <Link href={`/cours/${l.id}`} className="flex flex-wrap items-center gap-4 rounded-2xl border border-line bg-white p-4 transition hover:border-brand-300 hover:shadow-md">
              <Avatar name={name} gradient={as === "student" ? l.teacherGradient : "from-slate-400 to-slate-600"} size={48} />
              <span className="min-w-0 flex-1">
                <span className="block font-extrabold">{name}</span>
                <span className="flex items-center gap-1.5 text-sm text-muted">
                  <CalendarDays className="h-4 w-4" /> <LocalTime iso={l.startsAt.toISOString()} /> · {l.durationMin === 30 ? "30 min" : "1 h"}
                  {l.subject ? ` · ${l.subject}` : ""}
                </span>
              </span>
              {l.isTrial && <span className="rounded-full bg-pink-50 px-2.5 py-1 text-xs font-bold text-pink-600">Cours d&apos;essai</span>}
              <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${st.tone}`}>{st.label}</span>
              <span className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-bold ${soon || needsAction ? "bg-brand-500 text-white" : "bg-surface text-ink"}`}>
                <Video className="h-4 w-4" /> {soon ? "Rejoindre" : needsAction ? "Confirmer" : "Détails"}
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
