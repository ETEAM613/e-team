import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ChevronLeft, MessageCircle } from "lucide-react";
import { requireUser } from "@/lib/server/auth";
import { execute, query } from "@/lib/server/db";
import {
  canMessageTeacher,
  getConversationForUser,
  getTeacherRowBySlug,
  getThread,
  listConversations,
  type ThreadMessage,
} from "@/lib/server/messages";
import Avatar from "@/components/Avatar";
import { btn } from "@/components/ui";
import Composer from "./Composer";
import AutoRefresh from "./AutoRefresh";

export const metadata: Metadata = { title: "Messagerie" };

const timeFmt = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", timeZone: "Europe/Paris" });

type Selected =
  | { kind: "thread"; id: string; name: string; gradient: string; slug: string; messages: ThreadMessage[] }
  | { kind: "new"; name: string; gradient: string; slug: string }
  | { kind: "blocked"; reason: string }
  | null;

export default async function MessagesPage({ searchParams }: { searchParams: Promise<{ c?: string; to?: string }> }) {
  const { c, to } = await searchParams;
  const user = await requireUser(to ? `/messages?to=${encodeURIComponent(to)}` : "/messages");

  let selected: Selected = null;

  if (to) {
    const row = await getTeacherRowBySlug(to);
    if (!row) selected = { kind: "blocked", reason: "Enseignant introuvable." };
    else {
      const existing = await query<{ id: string }>("SELECT id FROM conversations WHERE student_id = ? AND teacher_profile_id = ?", [user.id, row.id]);
      if (existing[0]) redirect(`/messages?c=${existing[0].id}`);
      if (!row.user_id) selected = { kind: "blocked", reason: "Ce profil est une démonstration : il ne reçoit pas de messages. Les vrais enseignants arrivent bientôt !" };
      else if (!(await canMessageTeacher(user, row))) selected = { kind: "blocked", reason: "Vous ne pouvez pas écrire à cet enseignant." };
      else selected = { kind: "new", name: row.display_name, gradient: row.gradient, slug: row.slug };
    }
  } else if (c) {
    const conv = await getConversationForUser(user, c);
    if (!conv) selected = { kind: "blocked", reason: "Conversation introuvable." };
    else {
      // Les messages reçus deviennent « lus » à l'ouverture
      await execute("UPDATE messages SET read_at = UTC_TIMESTAMP() WHERE conversation_id = ? AND sender_id <> ? AND read_at IS NULL", [c, user.id]);
      const list = await listConversations(user);
      const summary = list.find((x) => x.id === c);
      selected = {
        kind: "thread",
        id: c,
        name: summary?.otherName ?? "",
        gradient: summary?.gradient ?? "from-slate-400 to-slate-600",
        slug: summary?.teacherSlug ?? "",
        messages: await getThread(user, c),
      };
    }
  }

  const conversations = await listConversations(user);
  const hasSelection = selected !== null;

  return (
    <div className="container-page py-8">
      <h1 className="text-3xl font-extrabold sm:text-4xl">Messagerie</h1>

      <div className="mt-6 grid min-h-[560px] overflow-hidden rounded-[2rem] border border-line bg-white lg:grid-cols-[340px_1fr]">
        {/* Liste des conversations */}
        <aside className={`border-line lg:border-r ${hasSelection ? "hidden lg:block" : ""}`}>
          {conversations.length === 0 ? (
            <div className="p-8 text-center">
              <MessageCircle className="mx-auto h-10 w-10 text-brand-300" />
              <p className="mt-3 font-bold">Aucune conversation</p>
              <p className="mt-1 text-sm text-muted">
                {user.role === "enseignant"
                  ? "Les messages de vos élèves apparaîtront ici."
                  : "Écrivez à un enseignant depuis sa fiche."}
              </p>
              {user.role !== "enseignant" && (
                <Link href="/enseignants" className={`${btn.primary} mt-5 !py-2.5 text-sm`}>Trouver un enseignant</Link>
              )}
            </div>
          ) : (
            <ul>
              {conversations.map((cv) => {
                const active = selected?.kind === "thread" && selected.id === cv.id;
                return (
                  <li key={cv.id}>
                    <Link
                      href={`/messages?c=${cv.id}`}
                      className={`flex items-center gap-3 border-b border-line px-4 py-3.5 transition ${active ? "bg-brand-50" : "hover:bg-surface"}`}
                    >
                      <Avatar name={cv.otherName} gradient={cv.gradient} size={44} />
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center justify-between gap-2">
                          <span className="truncate font-bold">{cv.otherName}</span>
                          <span className="shrink-0 text-[11px] text-muted">{timeFmt.format(cv.lastAt)}</span>
                        </span>
                        <span className="flex items-center justify-between gap-2">
                          <span className={`truncate text-sm ${cv.unread ? "font-bold text-ink" : "text-muted"}`}>{cv.lastBody ?? "…"}</span>
                          {cv.unread > 0 && (
                            <span className="grid h-5 min-w-5 shrink-0 place-items-center rounded-full bg-brand-500 px-1.5 text-[11px] font-bold text-white">
                              {cv.unread}
                            </span>
                          )}
                        </span>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </aside>

        {/* Conversation */}
        <section className={`flex flex-col ${hasSelection ? "" : "hidden lg:flex"}`}>
          {!selected && (
            <div className="grid flex-1 place-items-center p-10 text-center text-muted">
              <div>
                <MessageCircle className="mx-auto h-12 w-12 text-brand-200" />
                <p className="mt-3">Choisissez une conversation.</p>
              </div>
            </div>
          )}

          {selected?.kind === "blocked" && (
            <div className="grid flex-1 place-items-center p-10 text-center">
              <div>
                <p className="font-bold">{selected.reason}</p>
                <Link href="/enseignants" className={`${btn.outline} mt-5`}>Voir les enseignants</Link>
              </div>
            </div>
          )}

          {(selected?.kind === "thread" || selected?.kind === "new") && (
            <>
              <header className="flex items-center gap-3 border-b border-line px-4 py-3">
                <Link href="/messages" className="rounded-full p-1.5 hover:bg-surface lg:hidden" aria-label="Retour aux conversations">
                  <ChevronLeft className="h-5 w-5" />
                </Link>
                <Avatar name={selected.name} gradient={selected.gradient} size={40} />
                <p className="flex-1 font-extrabold">{selected.name}</p>
                {selected.slug && user.role !== "enseignant" && (
                  <Link href={`/enseignants/${selected.slug}`} className="text-sm font-bold text-brand-600 hover:underline">Voir la fiche</Link>
                )}
              </header>

              <div className="flex flex-1 flex-col-reverse overflow-y-auto bg-surface/50 px-4 py-5" style={{ maxHeight: 520 }}>
                <div className="space-y-2">
                  {selected.kind === "new" && (
                    <p className="mx-auto max-w-sm rounded-2xl bg-white p-4 text-center text-sm text-muted ring-1 ring-line">
                      Présentez-vous et posez vos questions : l&apos;enseignant est prévenu par e-mail.
                    </p>
                  )}
                  {selected.kind === "thread" &&
                    selected.messages.map((m) => (
                      <div key={m.id} className={`flex ${m.mine ? "justify-end" : "justify-start"}`}>
                        <div
                          className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-[15px] leading-relaxed ${
                            m.mine ? "rounded-br-md bg-brand-500 text-white" : "rounded-bl-md bg-white ring-1 ring-line"
                          }`}
                        >
                          <p className="whitespace-pre-wrap break-words">{m.body}</p>
                          <p className={`mt-1 text-right text-[11px] ${m.mine ? "text-white/70" : "text-muted"}`}>{timeFmt.format(m.createdAt)}</p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              <Composer key={selected.kind === "thread" ? selected.id : selected.slug} conversationId={selected.kind === "thread" ? selected.id : ""} teacher={selected.kind === "new" ? selected.slug : ""} />
              {selected.kind === "thread" && <AutoRefresh />}
            </>
          )}
        </section>
      </div>
    </div>
  );
}
