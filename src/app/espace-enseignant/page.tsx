import type { Metadata } from "next";
import Link from "next/link";
import { BadgeCheck, Clock, Eye, FileText, XCircle, Zap } from "lucide-react";
import { requireUser } from "@/lib/server/auth";
import { getTeacherRowByUser, toTeacher } from "@/lib/server/teachers";
import { setAvailableNow } from "@/app/actions/account";
import { btn } from "@/components/ui";
import TeacherProfileForm from "./TeacherProfileForm";

export const metadata: Metadata = { title: "Espace enseignant" };

const STATUS = {
  draft: { icon: FileText, label: "Brouillon", text: "Complétez votre profil puis envoyez-le pour validation.", tone: "bg-surface text-ink" },
  pending: { icon: Clock, label: "En cours de vérification", text: "L'équipe e-team vérifie votre profil (diplômes et antécédents). Vous serez prévenu par e-mail.", tone: "bg-amber-50 text-amber-800" },
  approved: { icon: BadgeCheck, label: "Profil en ligne", text: "Votre profil est visible par les élèves.", tone: "bg-emerald-50 text-emerald-800" },
  rejected: { icon: XCircle, label: "Profil refusé", text: "Votre profil n'a pas été validé. Modifiez-le puis renvoyez-le.", tone: "bg-rose-50 text-rose-800" },
} as const;

export default async function TeacherSpacePage() {
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

      {row?.status === "approved" && (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-[1.5rem] border border-line bg-white p-5">
          <div>
            <p className="flex items-center gap-2 font-extrabold"><Zap className="h-5 w-5 text-rose-500" /> Disponible maintenant (SOS)</p>
            <p className="text-sm text-muted">Activez-le quand vous pouvez répondre tout de suite à un élève.</p>
          </div>
          <form action={setAvailableNow.bind(null, !row.available_now)}>
            <button
              className={`rounded-full px-5 py-2.5 text-sm font-bold transition ${
                row.available_now ? "bg-emerald-500 text-white hover:bg-emerald-600" : "bg-surface text-ink hover:bg-brand-50"
              }`}
            >
              {row.available_now ? "Disponible ✓ (cliquer pour arrêter)" : "Me rendre disponible"}
            </button>
          </form>
        </div>
      )}

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
