import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, Clock, MessageCircle, Zap } from "lucide-react";
import PageHero from "@/components/PageHero";
import Avatar from "@/components/Avatar";
import { btn } from "@/components/ui";
import { getCurrentUser } from "@/lib/server/auth";
import { listTeachers } from "@/lib/server/teachers";
import { myCurrentSos } from "@/lib/server/sos";
import { cancelSos } from "@/app/actions/sos";
import LaunchSosForm from "./LaunchSosForm";

export const metadata: Metadata = { title: "SOS — une question urgente" };

export default async function SosPage() {
  const user = await getCurrentUser();
  const teachers = (await listTeachers(user?.gender ?? null)).filter((t) => t.availableNow);
  const current = user && process.env.DATABASE_URL ? await myCurrentSos(user.id) : null;

  return (
    <>
      <PageHero
        eyebrow="SOS · 1:1"
        title="Une question urgente ? Lancez un SOS."
        text="Votre demande est envoyée à tous les enseignants SOS. Le premier disponible vous répond, directement dans votre messagerie."
        gradient="from-rose-500 via-red-500 to-orange-500"
        icon={<Zap className="h-7 w-7 fill-white" />}
      />

      <div className="container-page grid gap-8 py-10 lg:grid-cols-[1.2fr_1fr]">
        <div>
          {!user ? (
            <div className="rounded-[2rem] border border-line bg-white p-7 text-center">
              <h2 className="text-2xl font-extrabold">Connectez-vous pour lancer un SOS</h2>
              <p className="mt-2 text-muted">Les enseignants vous répondent dans votre messagerie e-team.</p>
              <div className="mt-6 flex justify-center gap-3">
                <Link href="/connexion?suite=/sos" className={btn.dark}>Connexion</Link>
                <Link href="/inscription" className={btn.primary}>Créer mon compte</Link>
              </div>
            </div>
          ) : current?.status === "open" ? (
            <div className="rounded-[2rem] border-2 border-rose-200 bg-white p-7">
              <p className="flex items-center gap-2 text-lg font-extrabold text-rose-600">
                <Clock className="h-5 w-5" /> SOS envoyé, en attente d&apos;un enseignant…
              </p>
              <p className="mt-3 rounded-2xl bg-surface p-4">« {current.question} »</p>
              <p className="mt-3 text-sm text-muted">
                Vous serez prévenu par e-mail dès qu&apos;un enseignant accepte. La demande reste ouverte pendant 1 heure.
              </p>
              <form action={cancelSos.bind(null, current.id)} className="mt-5">
                <button className={btn.outline}>Annuler mon SOS</button>
              </form>
            </div>
          ) : current?.status === "taken" ? (
            <div className="rounded-[2rem] border-2 border-emerald-200 bg-white p-7">
              <p className="flex items-center gap-2 text-lg font-extrabold text-emerald-600">
                <CheckCircle2 className="h-5 w-5" /> {current.teacherName} a pris votre SOS !
              </p>
              <p className="mt-3 rounded-2xl bg-surface p-4">« {current.question} »</p>
              <Link href={`/messages?c=${current.conversationId}`} className={`${btn.primary} mt-5`}>
                <MessageCircle className="h-5 w-5" /> Ouvrir la conversation
              </Link>
              <div className="mt-6 border-t border-line pt-6">
                <p className="mb-3 font-bold">Une autre question ?</p>
                <LaunchSosForm />
              </div>
            </div>
          ) : (
            <div className="rounded-[2rem] border border-line bg-white p-7">
              <h2 className="text-2xl font-extrabold">Votre question</h2>
              <p className="mt-1 text-sm text-muted">Une phrase suffit : l&apos;enseignant en saura plus en vous répondant.</p>
              <div className="mt-5">
                <LaunchSosForm />
              </div>
            </div>
          )}
        </div>

        <aside className="space-y-4">
          <div className="rounded-[2rem] border border-line bg-white p-6">
            <p className="font-extrabold">{teachers.length} enseignant{teachers.length > 1 ? "s" : ""} SOS</p>
            <p className="text-sm text-muted">Ils reçoivent une alerte à chaque SOS.</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {teachers.slice(0, 12).map((t) => (
                <Link key={t.id} href={`/enseignants/${t.id}`} title={t.name}>
                  <Avatar name={t.name} gradient={t.gradient} size={44} />
                </Link>
              ))}
            </div>
          </div>
          <div className="rounded-[2rem] bg-ink p-6 text-white">
            {[
              "Vous écrivez votre question et lancez le SOS.",
              "Tous les enseignants SOS reçoivent une alerte par e-mail.",
              "Le premier disponible accepte : la conversation s'ouvre dans votre messagerie.",
            ].map((step, i) => (
              <p key={step} className="flex gap-3 py-2">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-rose-500 text-sm font-extrabold">{i + 1}</span>
                <span className="text-white/85">{step}</span>
              </p>
            ))}
          </div>
        </aside>
      </div>
    </>
  );
}
