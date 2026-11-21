"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { randomUUID } from "node:crypto";
import { requireUser } from "@/lib/server/auth";
import { execute, query } from "@/lib/server/db";
import { canMessageTeacher, getConversationForUser, getTeacherRowBySlug } from "@/lib/server/messages";
import { notify, siteUrl } from "@/lib/server/mail";
import type { FormState } from "./auth";

const MAX = 2000;

export async function sendMessage(_: FormState, formData: FormData): Promise<FormState> {
  const user = await requireUser("/messages");
  const body = String(formData.get("body") ?? "").trim();
  if (!body) return { error: "Écrivez un message." };
  if (body.length > MAX) return { error: `Message trop long (${MAX} caractères maximum).` };

  let conversationId = String(formData.get("conversationId") ?? "");

  if (!conversationId) {
    // Premier message à un enseignant : on vérifie qu'il a le droit de lui écrire.
    const row = await getTeacherRowBySlug(String(formData.get("teacher") ?? ""));
    if (!row) return { error: "Enseignant introuvable." };
    if (!row.user_id) return { error: "Ce profil est une démonstration : il ne reçoit pas de messages." };
    if (!(await canMessageTeacher(user, row))) return { error: "Vous ne pouvez pas écrire à cet enseignant." };
    const existing = await query<{ id: string }>("SELECT id FROM conversations WHERE student_id = ? AND teacher_profile_id = ?", [
      user.id,
      row.id,
    ]);
    conversationId = existing[0]?.id ?? randomUUID();
    if (!existing[0]) {
      await execute("INSERT INTO conversations (id, student_id, teacher_profile_id) VALUES (?, ?, ?)", [conversationId, user.id, row.id]);
    }
  }

  const conv = await getConversationForUser(user, conversationId);
  if (!conv) return { error: "Conversation introuvable." };

  // Destinataire : l'autre personne de la conversation
  const recipientId = conv.student_id === user.id ? conv.teacher_user : conv.student_id;
  const [{ pending }] = await query<{ pending: number }>(
    "SELECT COUNT(*) AS pending FROM messages WHERE conversation_id = ? AND sender_id = ? AND read_at IS NULL",
    [conversationId, user.id],
  );

  await execute("INSERT INTO messages (id, conversation_id, sender_id, body) VALUES (?, ?, ?, ?)", [randomUUID(), conversationId, user.id, body]);
  await execute("UPDATE conversations SET last_message_at = UTC_TIMESTAMP() WHERE id = ?", [conversationId]);

  // Un seul e-mail tant que le destinataire n'a pas lu les messages précédents (évite d'inonder sa boîte).
  if (recipientId && Number(pending) === 0) {
    const [r] = await query<{ email: string; first_name: string; status: string }>(
      "SELECT email, first_name, status FROM users WHERE id = ?",
      [recipientId],
    );
    if (r && r.status === "active") {
      await notify(
        r.email,
        `Nouveau message de ${user.firstName} sur e-team`,
        `Bonjour ${r.first_name},\n\n${user.firstName} vous a écrit :\n\n« ${body.slice(0, 300)}${body.length > 300 ? "…" : ""} »\n\nRépondre :\n${siteUrl()}/messages?c=${conversationId}\n\nL'équipe e-team`,
      );
    }
  }

  revalidatePath("/messages");
  if (!formData.get("conversationId")) redirect(`/messages?c=${conversationId}`);
  return { ok: "sent" };
}
