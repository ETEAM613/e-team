import "server-only";
import { query } from "./db";
import { migrate } from "./migrate";
import type { CurrentUser } from "./auth";

// SOS : une demande est envoyée à TOUS les enseignants qui participent au SOS (même genre que l'élève).
// Le premier qui clique « Je prends » obtient la demande ; une conversation s'ouvre avec l'élève.
// Une demande non prise expire au bout d'une heure.

export const SOS_EXPIRE_MINUTES = 60;

export type SosRequest = {
  id: string;
  question: string;
  status: "open" | "taken" | "cancelled";
  createdAt: Date;
  conversationId: string | null;
  teacherName: string | null;
  studentFirstName?: string;
};

/** Dernière demande SOS de l'élève (en cours ou prise récemment). */
export async function myCurrentSos(userId: string): Promise<SosRequest | null> {
  await migrate();
  const rows = await query<{
    id: string;
    question: string;
    status: SosRequest["status"];
    created_at: Date;
    conversation_id: string | null;
    teacher_name: string | null;
  }>(
    `SELECT s.id, s.question, s.status, s.created_at, s.conversation_id, t.display_name AS teacher_name
       FROM sos_requests s LEFT JOIN teacher_profiles t ON t.user_id = s.teacher_user_id
      WHERE s.student_id = ?
        AND ((s.status = 'open' AND s.created_at > UTC_TIMESTAMP() - INTERVAL ${SOS_EXPIRE_MINUTES} MINUTE)
          OR (s.status = 'taken' AND s.taken_at > UTC_TIMESTAMP() - INTERVAL 1 DAY))
      ORDER BY s.created_at DESC LIMIT 1`,
    [userId],
  );
  const r = rows[0];
  return r
    ? { id: r.id, question: r.question, status: r.status, createdAt: new Date(r.created_at), conversationId: r.conversation_id, teacherName: r.teacher_name }
    : null;
}

/** Enseignant SOS validé ? (renvoie son profil) */
export async function sosTeacherProfile(user: CurrentUser) {
  const rows = await query<{ id: string; available_now: number; status: string }>(
    "SELECT id, available_now, status FROM teacher_profiles WHERE user_id = ?",
    [user.id],
  );
  return rows[0] ?? null;
}

/** Demandes SOS en attente visibles par un enseignant (même genre, participant au SOS). */
export async function openSosForTeacher(user: CurrentUser): Promise<SosRequest[]> {
  await migrate();
  const profile = await sosTeacherProfile(user);
  if (!profile || profile.status !== "approved" || !profile.available_now) return [];
  const rows = await query<{ id: string; question: string; created_at: Date; first_name: string }>(
    `SELECT s.id, s.question, s.created_at, u.first_name
       FROM sos_requests s JOIN users u ON u.id = s.student_id
      WHERE s.status = 'open' AND s.gender = ? AND s.student_id <> ?
        AND s.created_at > UTC_TIMESTAMP() - INTERVAL ${SOS_EXPIRE_MINUTES} MINUTE
      ORDER BY s.created_at`,
    [user.gender, user.id],
  );
  return rows.map((r) => ({
    id: r.id,
    question: r.question,
    status: "open",
    createdAt: new Date(r.created_at),
    conversationId: null,
    teacherName: null,
    studentFirstName: r.first_name,
  }));
}

/** E-mails des enseignants à prévenir pour un SOS de ce genre. */
export async function sosRecipients(gender: string, excludeUserId: string) {
  return query<{ email: string; first_name: string }>(
    `SELECT u.email, u.first_name
       FROM teacher_profiles t JOIN users u ON u.id = t.user_id
      WHERE t.status = 'approved' AND t.available_now = 1 AND t.gender = ?
        AND u.status = 'active' AND u.id <> ?`,
    [gender, excludeUserId],
  );
}
