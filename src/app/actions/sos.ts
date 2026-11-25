"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { randomUUID } from "node:crypto";
import { requireUser } from "@/lib/server/auth";
import { execute, query } from "@/lib/server/db";
import { myCurrentSos, SOS_EXPIRE_MINUTES, sosRecipients, sosTeacherProfile } from "@/lib/server/sos";
import { notify, siteUrl } from "@/lib/server/mail";
import type { FormState } from "./auth";

/** L'élève lance un SOS : tous les enseignants SOS de son genre sont prévenus par e-mail. */
export async function launchSos(_: FormState, formData: FormData): Promise<FormState> {
  const user = await requireUser("/sos");
  const question = String(formData.get("question") ?? "").trim();
  if (question.length < 5) return { error: "Décrivez votre question en une phrase." };
  if (question.length > 1000) return { error: "Question trop longue (1000 caractères maximum)." };

  const current = await myCurrentSos(user.id);
  if (current?.status === "open") return { error: "Vous avez déjà un SOS en attente." };

  const id = randomUUID();
  await execute("INSERT INTO sos_requests (id, student_id, gender, question) VALUES (?, ?, ?, ?)", [id, user.id, user.gender, question]);

  const teachers = await sosRecipients(user.gender, user.id);
  for (const t of teachers) {
    await notify(
      t.email,
      `🚨 SOS e-team : ${user.firstName} a besoin d'un enseignant`,
      `Bonjour ${t.first_name},\n\n${user.firstName} a lancé un SOS :\n\n« ${question} »\n\nSi vous êtes disponible maintenant, prenez la demande ici (le premier qui accepte l'obtient) :\n${siteUrl()}/espace-enseignant#sos\n\nVous ne voulez plus recevoir les SOS ? Désactivez-les depuis votre espace enseignant.\n\nL'équipe e-team`,
    );
  }

  revalidatePath("/sos");
  return {
    ok: teachers.length
      ? `Votre SOS a été envoyé à ${teachers.length} enseignant${teachers.length > 1 ? "s" : ""}. Le premier disponible vous répond.`
      : "Votre SOS est enregistré. Aucun enseignant SOS n'est inscrit pour le moment : l'équipe est prévenue.",
  };
}

export async function cancelSos(requestId: string) {
  const user = await requireUser("/sos");
  await execute("UPDATE sos_requests SET status = 'cancelled' WHERE id = ? AND student_id = ? AND status = 'open'", [requestId, user.id]);
  revalidatePath("/sos");
}

/** L'enseignant prend un SOS : le premier qui clique l'obtient, une conversation s'ouvre avec l'élève. */
export async function takeSos(requestId: string) {
  const user = await requireUser("/espace-enseignant");
  const profile = await sosTeacherProfile(user);
  if (!profile || profile.status !== "approved") redirect("/espace-enseignant");

  const res = await execute(
    `UPDATE sos_requests SET status = 'taken', teacher_user_id = ?, taken_at = UTC_TIMESTAMP()
      WHERE id = ? AND status = 'open' AND gender = ? AND student_id <> ?
        AND created_at > UTC_TIMESTAMP() - INTERVAL ${SOS_EXPIRE_MINUTES} MINUTE`,
    [user.id, requestId, user.gender, user.id],
  );
  if (res.affectedRows !== 1) redirect("/espace-enseignant?sos=deja-pris#sos");

  const [req] = await query<{ student_id: string; question: string }>("SELECT student_id, question FROM sos_requests WHERE id = ?", [requestId]);

  // Conversation élève ↔ enseignant (réutilisée si elle existe déjà)
  const existing = await query<{ id: string }>("SELECT id FROM conversations WHERE student_id = ? AND teacher_profile_id = ?", [req.student_id, profile.id]);
  const conversationId = existing[0]?.id ?? randomUUID();
  if (!existing[0]) {
    await execute("INSERT INTO conversations (id, student_id, teacher_profile_id) VALUES (?, ?, ?)", [conversationId, req.student_id, profile.id]);
  }
  await execute("INSERT INTO messages (id, conversation_id, sender_id, body, created_at, read_at) VALUES (?, ?, ?, ?, UTC_TIMESTAMP(3), UTC_TIMESTAMP())", [
    randomUUID(),
    conversationId,
    req.student_id,
    `🚨 SOS : ${req.question}`,
  ]);
  await execute("INSERT INTO messages (id, conversation_id, sender_id, body, created_at) VALUES (?, ?, ?, ?, UTC_TIMESTAMP(3) + INTERVAL 1 SECOND)", [
    randomUUID(),
    conversationId,
    user.id,
    `Bonjour ! J'ai bien reçu votre SOS, je suis là pour vous aider.`,
  ]);
  await execute("UPDATE conversations SET last_message_at = UTC_TIMESTAMP() WHERE id = ?", [conversationId]);
  await execute("UPDATE sos_requests SET conversation_id = ? WHERE id = ?", [conversationId, requestId]);

  const [student] = await query<{ email: string; first_name: string }>("SELECT email, first_name FROM users WHERE id = ?", [req.student_id]);
  if (student) {
    await notify(
      student.email,
      `${user.firstName} a pris votre SOS`,
      `Bonjour ${student.first_name},\n\n${user.firstName} ${user.lastName} a accepté votre SOS et vous attend :\n${siteUrl()}/messages?c=${conversationId}\n\nL'équipe e-team`,
    );
  }

  revalidatePath("/espace-enseignant");
  revalidatePath("/sos");
  redirect(`/messages?c=${conversationId}`);
}

/** L'enseignant choisit de participer (ou non) au SOS. */
export async function setSosOptIn(on: boolean) {
  const user = await requireUser("/espace-enseignant");
  await execute("UPDATE users SET sos_opt_in = ? WHERE id = ?", [on ? 1 : 0, user.id]);
  await execute("UPDATE teacher_profiles SET available_now = ? WHERE user_id = ?", [on ? 1 : 0, user.id]);
  revalidatePath("/espace-enseignant");
  revalidatePath("/sos");
}
