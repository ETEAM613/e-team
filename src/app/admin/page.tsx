import type { Metadata } from "next";
import Link from "next/link";
import { BadgeCheck, Ban, Check, Clock, RotateCcw, Trash2, Users, X } from "lucide-react";
import { requireAdmin } from "@/lib/server/auth";
import { query } from "@/lib/server/db";
import { toTeacher, type TeacherRow } from "@/lib/server/teachers";
import { removeDemoTeachers, setTeacherStatus, setUserStatus } from "@/app/actions/account";
import Avatar from "@/components/Avatar";
import LocalTime from "@/components/LocalTime";
import { nowMs } from "@/lib/server/clock";
import { allLessons } from "@/lib/server/lessons";
import { chip, input } from "@/components/ui";

export const metadata: Metadata = { title: "Administration" };

type UserRow = {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  gender: string;
  role: string;
  status: string;
  created_at: Date;
};

const dateFmt = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "short", year: "numeric" });

export default async function AdminPage() {
  const admin = await requireAdmin();
  const lessons = await allLessons();
  const upcoming = lessons.filter((l) => l.status === "booked" && l.startsAt.getTime() + l.durationMin * 60000 > nowMs()).reverse();
  const [pending, approved, users, [{ demo }]] = await Promise.all([
    query<TeacherRow & { email: string | null }>(
      `SELECT t.*, u.email FROM teacher_profiles t LEFT JOIN users u ON u.id = t.user_id WHERE t.status = 'pending' ORDER BY t.updated_at`,
    ),
    query<TeacherRow>("SELECT * FROM teacher_profiles WHERE status = 'approved' ORDER BY is_demo, display_name"),
    query<UserRow>("SELECT id, email, first_name, last_name, gender, role, status, created_at FROM users ORDER BY created_at DESC LIMIT 200"),
    query<{ demo: number }>("SELECT COUNT(*) AS demo FROM teacher_profiles WHERE is_demo = 1"),
  ]);

  const stats = [
    { label: "Inscrits", value: users.length, tone: "from-brand-500 to-indigo-700" },
    { label: "Profils à vérifier", value: pending.length, tone: "from-amber-400 to-orange-500" },
    { label: "Enseignants en ligne", value: approved.length, tone: "from-teal-400 to-sky-600" },
    { label: "Cours à venir", value: upcoming.length, tone: "from-rose-500 to-pink-600" },
  ];

  return (
    <div className="container-page py-12">
      <h1 className="text-4xl font-extrabold">Administration</h1>
      <p className="mt-2 text-muted">Validation des enseignants et gestion des comptes.</p>

      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className={`rounded-[1.5rem] bg-gradient-to-br p-5 text-white ${s.tone}`}>
            <p className="font-display text-4xl font-extrabold">{s.value}</p>
            <p className="text-sm text-white/85">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Cours */}
      <section className="mt-12">
        <h2 className="text-2xl font-extrabold">Cours à venir</h2>
        <div className="mt-4 overflow-x-auto rounded-[1.5rem] border border-line bg-white">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="bg-surface text-muted">
              <tr>
                <th className="px-5 py-3 font-bold">Date</th>
                <th className="px-5 py-3 font-bold">Enseignant</th>
                <th className="px-5 py-3 font-bold">Élève</th>
                <th className="px-5 py-3 font-bold">Durée</th>
                <th className="px-5 py-3 font-bold">Sujet</th>
              </tr>
            </thead>
            <tbody>
              {upcoming.length === 0 && (
                <tr><td colSpan={5} className="px-5 py-6 text-center text-muted">Aucun cours à venir.</td></tr>
              )}
              {upcoming.map((l) => (
                <tr key={l.id} className="border-t border-line">
                  <td className="px-5 py-3 font-semibold"><Link href={`/cours/${l.id}`} className="hover:underline"><LocalTime iso={l.startsAt.toISOString()} /></Link></td>
                  <td className="px-5 py-3">{l.teacherName}</td>
                  <td className="px-5 py-3">{l.childName ? `${l.childName} (${l.studentName})` : l.studentName}{l.isTrial ? " · essai" : ""}</td>
                  <td className="px-5 py-3">{l.durationMin === 30 ? "30 min" : "1 h"}</td>
                  <td className="px-5 py-3 text-muted">{l.subject ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-xs text-muted">{lessons.filter((l) => l.status === "booked").length} cours réservés et {lessons.filter((l) => l.status === "cancelled").length} annulés sur les 30 derniers jours et à venir.</p>
      </section>

      {/* Enseignants à vérifier */}
      <section className="mt-12">
        <h2 className="flex items-center gap-2 text-2xl font-extrabold"><Clock className="h-6 w-6 text-amber-500" /> Profils à vérifier</h2>
        <p className="mt-1 text-sm text-muted">Vérifiez les diplômes et les antécédents avant de valider.</p>
        {pending.length === 0 && <p className="mt-4 rounded-2xl border border-dashed border-line bg-white p-6 text-center text-muted">Aucun profil en attente.</p>}
        <div className="mt-4 space-y-4">
          {pending.map((row) => {
            const t = toTeacher(row);
            return (
              <article key={row.id} className="rounded-[1.5rem] border border-line bg-white p-6">
                <div className="flex flex-wrap items-start gap-4">
                  <Avatar name={t.name} gradient={t.gradient} size={64} />
                  <div className="min-w-0 flex-1">
                    <p className="text-lg font-extrabold">{t.name} <span className="text-sm font-semibold text-muted">· {t.title}</span></p>
                    <p className="text-sm text-muted">{row.email} · {t.gender === "homme" ? "Homme" : "Femme"} · {t.country}</p>
                    <p className="mt-2 font-semibold">{t.headline}</p>
                    <p className="mt-1 whitespace-pre-line text-sm text-ink/80">{t.bio}</p>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {t.subjects.map((s) => <span key={s} className={chip}>{s}</span>)}
                      {t.accepts.includes("garcon") && <span className="rounded-full bg-sky-50 px-2.5 py-1 text-xs font-semibold text-sky-700">Garçons</span>}
                      {t.accepts.includes("fille") && <span className="rounded-full bg-pink-50 px-2.5 py-1 text-xs font-semibold text-pink-700">Filles</span>}
                    </div>
                    {t.experience.length > 0 && (
                      <ul className="mt-3 list-inside list-disc text-sm text-muted">
                        {t.experience.map((e) => <li key={e}>{e}</li>)}
                      </ul>
                    )}
                  </div>
                </div>
                <div className="mt-5 flex flex-wrap items-end gap-3 border-t border-line pt-4">
                  <form action={setTeacherStatus.bind(null, row.id, "approved")}>
                    <button className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500 px-5 py-2.5 text-sm font-bold text-white hover:bg-emerald-600">
                      <Check className="h-4 w-4" /> Valider et mettre en ligne
                    </button>
                  </form>
                  <form action={setTeacherStatus.bind(null, row.id, "rejected")} className="flex flex-1 flex-wrap items-center gap-2">
                    <input name="note" placeholder="Motif du refus (visible par l'enseignant)" className={`${input} !py-2 min-w-56 flex-1 text-sm`} />
                    <button className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-5 py-2.5 text-sm font-bold text-rose-700 hover:bg-rose-100">
                      <X className="h-4 w-4" /> Refuser
                    </button>
                  </form>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* Enseignants en ligne */}
      <section className="mt-12">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 className="flex items-center gap-2 text-2xl font-extrabold"><BadgeCheck className="h-6 w-6 text-teal-500" /> Enseignants en ligne</h2>
          {Number(demo) > 0 && (
            <form action={removeDemoTeachers}>
              <button className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-4 py-2 text-sm font-bold text-rose-700 hover:bg-rose-100">
                <Trash2 className="h-4 w-4" /> Supprimer les {Number(demo)} profils de démonstration
              </button>
            </form>
          )}
        </div>
        <div className="mt-4 overflow-hidden rounded-[1.5rem] border border-line bg-white">
          {approved.map((row) => (
            <div key={row.id} className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-3 last:border-0">
              <span>
                <Link href={`/enseignants/${row.slug}`} className="font-bold hover:underline">{row.display_name}</Link>
                <span className="ml-2 text-sm text-muted">{row.gender === "homme" ? "Homme" : "Femme"}</span>
                {row.is_demo ? <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-800">Démo</span> : null}
              </span>
              <form action={setTeacherStatus.bind(null, row.id, "rejected")}>
                <button className="text-sm font-bold text-rose-600 hover:underline">Retirer du site</button>
              </form>
            </div>
          ))}
        </div>
      </section>

      {/* Utilisateurs */}
      <section className="mt-12">
        <h2 className="flex items-center gap-2 text-2xl font-extrabold"><Users className="h-6 w-6 text-brand-500" /> Comptes</h2>
        <div className="mt-4 overflow-x-auto rounded-[1.5rem] border border-line bg-white">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="bg-surface text-muted">
              <tr>
                <th className="px-5 py-3 font-bold">Nom</th>
                <th className="px-5 py-3 font-bold">E-mail</th>
                <th className="px-5 py-3 font-bold">Genre</th>
                <th className="px-5 py-3 font-bold">Type</th>
                <th className="px-5 py-3 font-bold">Inscrit le</th>
                <th className="px-5 py-3 font-bold">Statut</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-t border-line">
                  <td className="px-5 py-3 font-semibold">{u.first_name} {u.last_name}</td>
                  <td className="px-5 py-3 text-muted">{u.email}</td>
                  <td className="px-5 py-3">{u.gender === "homme" ? "Homme" : "Femme"}</td>
                  <td className="px-5 py-3 capitalize">{u.role}</td>
                  <td className="px-5 py-3 text-muted">{dateFmt.format(new Date(u.created_at))}</td>
                  <td className="px-5 py-3">
                    {u.id === admin.id ? (
                      <span className="text-muted">Vous</span>
                    ) : u.status === "active" ? (
                      <form action={setUserStatus.bind(null, u.id, "suspended")}>
                        <button className="inline-flex items-center gap-1 font-bold text-rose-600 hover:underline"><Ban className="h-4 w-4" /> Suspendre</button>
                      </form>
                    ) : (
                      <form action={setUserStatus.bind(null, u.id, "active")}>
                        <button className="inline-flex items-center gap-1 font-bold text-emerald-600 hover:underline"><RotateCcw className="h-4 w-4" /> Réactiver</button>
                      </form>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
