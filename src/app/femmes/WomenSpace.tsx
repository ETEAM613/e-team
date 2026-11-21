import Link from "next/link";
import { ArrowRight, CheckCircle2, Radio } from "lucide-react";
import { getTeacher, LIVE_SESSIONS, TEACHERS } from "@/lib/data";
import TeacherCard from "@/components/TeacherCard";
import { btn } from "@/components/ui";

export default function WomenSpace() {
  const teachers = TEACHERS.filter((t) => t.gender === "femme" && t.accepts.includes("femme"));
  const live = LIVE_SESSIONS.filter((s) => getTeacher(s.teacherId)?.gender === "femme");

  return (
    <>
      <div className="grid gap-4 md:grid-cols-3">
        {[
          "Apprentissage entre femmes avec des enseignantes qualifiées",
          "Halakha, histoire juive et vie juive quotidienne",
          "Moments d'étude accessibles même en journée",
        ].map((p) => (
          <div key={p} className="flex gap-3 rounded-[2rem] border border-line bg-white p-6 font-semibold">
            <CheckCircle2 className="h-6 w-6 shrink-0 text-pink-500" /> {p}
          </div>
        ))}
      </div>

      <div className="mt-12 flex flex-wrap items-end justify-between gap-3">
        <h2 className="text-3xl font-extrabold">Cours en direct entre femmes</h2>
        <Link href="/cours-en-direct" className="inline-flex items-center gap-1 font-bold text-pink-600 hover:underline">
          Tout le programme <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      <div className="mt-5 grid gap-3 md:grid-cols-3">
        {live.map((s) => (
          <div key={s.id} className="rounded-[1.5rem] bg-gradient-to-br from-pink-50 to-fuchsia-50 p-5 ring-1 ring-pink-100">
            <p className="flex items-center gap-1.5 text-xs font-bold text-pink-600"><Radio className="h-3.5 w-3.5" /> Gratuit · {s.time}</p>
            <p className="mt-2 font-display text-lg font-extrabold">{s.title}</p>
            <p className="text-sm text-muted">{getTeacher(s.teacherId)?.name}</p>
          </div>
        ))}
      </div>

      <h2 className="mt-12 text-3xl font-extrabold">Nos enseignantes</h2>
      <div className="mt-5 space-y-4">
        {teachers.map((t) => <TeacherCard key={t.id} teacher={t} />)}
      </div>

      <div className="mt-12 text-center">
        <Link href="/inscription?genre=femme" className={btn.primary}>Créer mon compte</Link>
      </div>
    </>
  );
}
