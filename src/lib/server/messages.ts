import "server-only";
import { query } from "./db";
import { migrate } from "./migrate";
import { toTeacher, type TeacherRow } from "./teachers";
import type { CurrentUser } from "./auth";

// Messagerie élève/parent ↔ enseignant. Toutes les vérifications d'accès sont faites ici.

export type ConversationSummary = {
  id: string;
  otherName: string;
  gradient: string;
  teacherSlug: string;
  lastBody: string | null;
  lastAt: Date;
  unread: number;
};

export type ThreadMessage = { id: string; mine: boolean; body: string; createdAt: Date };

/**
 * Un élève peut écrire à un enseignant validé du même genre que lui.
 * Un parent peut aussi écrire à un enseignant qui accepte le genre de l'un de ses enfants.
 */
export async function canMessageTeacher(user: CurrentUser, row: TeacherRow): Promise<boolean> {
  if (row.status !== "approved" || !row.user_id || row.user_id === user.id) return false;
  const t = toTeacher(row);
  if (t.gender === user.gender && t.accepts.includes(user.gender)) return true;
  const kids = await query<{ gender: "garcon" | "fille" }>("SELECT gender FROM children WHERE parent_id = ?", [user.id]);
  return kids.some((k) => t.accepts.includes(k.gender));
}

export async function getTeacherRowBySlug(slug: string): Promise<TeacherRow | null> {
  await migrate();
  const rows = await query<TeacherRow>("SELECT * FROM teacher_profiles WHERE slug = ?", [slug]);
  return rows[0] ?? null;
}

/** Conversations de l'utilisateur : côté élève, ou côté enseignant s'il a un profil. */
export async function listConversations(user: CurrentUser): Promise<ConversationSummary[]> {
  await migrate();
  const rows = await query<{
    id: string;
    student_id: string;
    student_first: string;
    student_last: string;
    teacher_name: string;
    teacher_user: string | null;
    gradient: string;
    slug: string;
    last_message_at: Date;
    last_body: string | null;
    unread: number;
  }>(
    `SELECT c.id, c.student_id, u.first_name AS student_first, u.last_name AS student_last,
            t.display_name AS teacher_name, t.user_id AS teacher_user, t.gradient, t.slug, c.last_message_at,
            (SELECT m.body FROM messages m WHERE m.conversation_id = c.id ORDER BY m.created_at DESC LIMIT 1) AS last_body,
            (SELECT COUNT(*) FROM messages m WHERE m.conversation_id = c.id AND m.sender_id <> ? AND m.read_at IS NULL) AS unread
       FROM conversations c
       JOIN teacher_profiles t ON t.id = c.teacher_profile_id
       JOIN users u ON u.id = c.student_id
      WHERE c.student_id = ? OR t.user_id = ?
      ORDER BY c.last_message_at DESC`,
    [user.id, user.id, user.id],
  );
  return rows.map((r) => {
    const iAmStudent = r.student_id === user.id;
    return {
      id: r.id,
      otherName: iAmStudent ? r.teacher_name : `${r.student_first} ${r.student_last}`,
      gradient: iAmStudent ? r.gradient : "from-slate-400 to-slate-600",
      teacherSlug: r.slug,
      lastBody: r.last_body,
      lastAt: new Date(r.last_message_at),
      unread: Number(r.unread),
    };
  });
}

/** Une conversation, seulement si l'utilisateur en fait partie. */
export async function getConversationForUser(user: CurrentUser, conversationId: string) {
  await migrate();
  const rows = await query<{ id: string; student_id: string; teacher_user: string | null; teacher_profile_id: string }>(
    `SELECT c.id, c.student_id, t.user_id AS teacher_user, c.teacher_profile_id
       FROM conversations c JOIN teacher_profiles t ON t.id = c.teacher_profile_id
      WHERE c.id = ?`,
    [conversationId],
  );
  const c = rows[0];
  if (!c || (c.student_id !== user.id && c.teacher_user !== user.id)) return null;
  return c;
}

export async function getThread(user: CurrentUser, conversationId: string): Promise<ThreadMessage[]> {
  const rows = await query<{ id: string; sender_id: string; body: string; created_at: Date }>(
    "SELECT id, sender_id, body, created_at FROM messages WHERE conversation_id = ? ORDER BY created_at",
    [conversationId],
  );
  return rows.map((m) => ({ id: m.id, mine: m.sender_id === user.id, body: m.body, createdAt: new Date(m.created_at) }));
}

export async function unreadCount(userId: string): Promise<number> {
  const [r] = await query<{ n: number }>(
    `SELECT COUNT(*) AS n FROM messages m
       JOIN conversations c ON c.id = m.conversation_id
       JOIN teacher_profiles t ON t.id = c.teacher_profile_id
      WHERE (c.student_id = ? OR t.user_id = ?) AND m.sender_id <> ? AND m.read_at IS NULL`,
    [userId, userId, userId],
  );
  return Number(r?.n ?? 0);
}
