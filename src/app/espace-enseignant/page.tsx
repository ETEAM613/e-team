import type { Metadata } from "next";
import Link from "next/link";
import { BadgeCheck, Clock, Eye, FileText, XCircle, Zap } from "lucide-react";
import { requireUser } from "@/lib/server/auth";
import { getTeacherRowByUser, toTeacher } from "@/lib/server/teachers";
import { setSosOptIn, takeSos } from "@/app/actions/sos";
import { query } from "@/lib/server/db";
import { openSosForTeacher } from "@/lib/server/sos";
import { btn } from "@/components/ui";
import TeacherProfileForm from "./TeacherProfileForm";

export const metadata: Metadata = { title: "Espace enseignant" };

const STATUS = {
  draft: { icon: FileText, label: "Brouillon", text: "Complétez votre profil puis envoyez-le pour validation.", tone: "bg-surface text-ink" },
  pending: { icon: Clock, label: "En cours de vérification", text: "L'équipe e-team vérifie votre profil (diplômes et antécédents). Vous serez prévenu par e-mail.", tone: "bg-amber-50 text-amber-800" },
  approved: { icon: BadgeCheck, label: "Profil en ligne", text: "Votre profil est visible par les élèves.", tone: "bg-emerald-50 text-emerald-800" },
  rejected: { icon: XCircle, label: "Profil refusé", text: "Votre profil n'a pas été validé. Modifiez-le puis renvoyez-le.", tone: "bg-rose-50 text-rose-800" },
} as const;

const ago = (d: Date) => {
  const min = Math.max(1, Math.round((Date.now() - d.getTime()) / 60000));
  return min < 60 ? `il y a ${min} min` : "il y a plus d'une heure";
};

export default async function TeacherSpacePage({ searchParams }: { searchParams: Promise<{ sos?: string }> }) {
  const { sos } = await searchParams;
  const user = await requireUser("/espace-enseignant");

  if (user.role !== "enseignant") {
    return (
      <div className="container-page max-w-2xl py-16 text-center">
        <h1 className="text-3xl font-extrabold">Espace réservé aux enseignants</h1>
        <p className="mt-3 text-muted">Votre compte n&apos;est pas un compte enseignant. Pour enseigner sur e-team, contactez l&apos;équipe.</p>
        <Link href="/contact" className={`${btn.primary} mt-6`}>Nous contacter</Link>
      </div>
    );
  }

  const row = await getTeacherRowByUser(user.id);
  const [{ sos_opt_in }] = await query<{ sos_opt_in: number }>("SELECT sos_opt_in FROM users WHERE id = ?", [user.id]);
  const sosOn = !!sos_opt_in;
  const openSos = await openSosForTeacher(user);
  const status = STATUS[row?.status ?? "draft"];
  const teacher = row ? toTeacher(row) : null;

  return (
    <div className="container-page max-w-4xl py-12">
      <h1 className="text-4xl font-extrabold">Mon profil enseignant</h1>

      <div className={`mt-6 flex gap-3 rounded-[1.5rem] p-5 ${status.tone}`}>
        <status.icon className="mt-0.5 h-6 w-6 shrink-0" />
        <div className="flex-1">
          <p className="font-extrabold">{status.label}</p>
          <p className="text-sm">{status.text}</p>
          {row?.status === "rejected" && row.admin_note && <p className="mt-2 text-sm font-semibold">Motif : {row.admin_note}</p>}
        </div>
        {row?.status === "approved" && (
          <Link href={`/enseignants/${row.slug}`} className="inline-flex items-center gap-1.5 self-center text-sm font-bold hover:underline">
            <Eye className="h-4 w-4" /> Voir ma fiche
          </Link>
        )}
      </div>

      {/* SOS : participation et demandes en attente */}
      <section id="sos" className="mt-4 scroll-mt-24 rounded-[1.5rem] border border-line bg-white p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="flex items-center gap-2 font-extrabold"><Zap className="h-5 w-5 text-rose-500" /> Je participe au SOS</p>
            <p className="text-sm text-muted">Vous recevez un e-mail à chaque SOS d&apos;un élève. Le premier enseignant qui accepte répond.</p>
          </div>
          <div className="grid grid-cols-2 gap-1 rounded-full bg-surface p-1">
            <form action={setSosOptIn.bind(null, true)}>
              <button className={`w-full rounded-full px-5 py-2 text-sm font-bold transition ${sosOn ? "bg-rose-500 text-white" : "text-muted hover:text-ink"}`}>Oui</button>
            </form>
            <form action={setSosOptIn.bind(null, false)}>
              <button className={`w-full rounded-full px-5 py-2 text-sm font-bold transition ${!sosOn ? "bg-ink text-white" : "text-muted hover:text-ink"}`}>Non</button>
            </form>
          </div>
        </div>
        {sosOn && row?.status !== "approved" && (
          <p className="mt-3 text-sm text-muted">Vous recevrez les SOS dès que votre profil sera validé.</p>
        )}
        {sos === "deja-pris" && (
          <p className="mt-3 rounded-xl bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-800">Ce SOS a déjà été pris par un autre enseignant (ou a expiré).</p>
        )}
        {openSos.length > 0 && (
          <ul className="mt-4 space-y-3">
            {openSos.map((r) => (
              <li key={r.id} className="flex flex-wrap items-center gap-3 rounded-2xl bg-rose-50 p-4 ring-1 ring-rose-100">
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-rose-600">🚨 SOS de {r.studentFirstName} · {ago(r.createdAt)}</p>
                  <p className="mt-1 font-semibold">« {r.question} »</p>
                </div>
                <form action={takeSos.bind(null, r.id)}>
                  <button className="rounded-full bg-rose-500 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-rose-500/30 hover:bg-rose-600">
                    Je prends
                  </button>
                </form>
              </li>
            ))}
          </ul>
        )}
      </section>

      <TeacherProfileForm
        gender={user.gender}
        approved={row?.status === "approved"}
        initial={{
          displayName: teacher?.name ?? `${user.firstName} ${user.lastName}`,
          title: teacher?.title ?? "",
          headline: teacher?.headline ?? "",
          bio: teacher?.bio ?? "",
          country: teacher?.country ?? "",
          experience: teacher?.experience.join("\n") ?? "",
          subjects: teacher?.subjects ?? [],
          languages: teacher?.languages ?? ["Français"],
          levels: teacher?.levels ?? [],
          available: teacher?.available ?? [],
          kids: (teacher?.accepts ?? []).filter((a) => a === "garcon" || a === "fille"),
        }}
      />
    </div>
  );
}
