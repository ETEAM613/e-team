import "server-only";
import { query } from "./db";
import { migrate } from "./migrate";
import { zonedParts, zonedToUtc } from "@/lib/time";

// Réservation de cours : calcul des créneaux libres et listes de cours.

export const BOOKING_DAYS = 21; // on peut réserver jusqu'à 3 semaines à l'avance
export const MIN_NOTICE_MIN = 60; // au plus tard 1 heure avant le début
const STEP = 30 * 60 * 1000;

export async function getAvailability(profileId: string): Promise<Set<string>> {
  await migrate();
  const rows = await query<{ weekday: number; hour: number }>(
    "SELECT weekday, hour FROM teacher_availability WHERE teacher_profile_id = ?",
    [profileId],
  );
  return new Set(rows.map((r) => `${r.weekday}-${r.hour}`));
}

type Busy = { start: number; end: number };

async function busyTimes(profileId: string, studentId: string | null, from: Date, to: Date): Promise<Busy[]> {
  const rows = await query<{ starts_at: Date; duration_min: number }>(
    `SELECT starts_at, duration_min FROM lessons
      WHERE status = 'booked' AND starts_at < ? AND starts_at > ? - INTERVAL 2 HOUR
        AND (teacher_profile_id = ? OR student_id = ?)`,
    [to, from, profileId, studentId ?? ""],
  );
  return rows.map((r) => {
    const start = new Date(r.starts_at).getTime();
    return { start, end: start + r.duration_min * 60000 };
  });
}

/**
 * Créneaux libres (début en UTC) pour une durée donnée : dans les disponibilités hebdomadaires
 * de l'enseignant (son fuseau), sans chevaucher un cours déjà réservé (de l'enseignant ou de l'élève).
 */
export async function freeSlots(
  profile: { id: string; timezone: string },
  durationMin: 30 | 60,
  studentId: string | null,
  now = new Date(),
): Promise<string[]> {
  const avail = await getAvailability(profile.id);
  if (avail.size === 0) return [];
  const tz = profile.timezone;
  const earliest = now.getTime() + MIN_NOTICE_MIN * 60000;
  const horizon = now.getTime() + BOOKING_DAYS * 24 * 3600 * 1000;
  const busy = await busyTimes(profile.id, studentId, now, new Date(horizon));
  const covered = (t: number) => {
    const p = zonedParts(new Date(t), tz);
    return avail.has(`${p.weekday}-${p.hour}`);
  };

  const slots = new Set<string>();
  for (let d = 0; d <= BOOKING_DAYS; d++) {
    const day = zonedParts(new Date(now.getTime() + d * 24 * 3600 * 1000), tz);
    for (let h = 0; h < 24; h++) {
      if (!avail.has(`${day.weekday}-${h}`)) continue;
      for (const m of [0, 30]) {
        const start = zonedToUtc(day.year, day.month, day.day, h, m, tz).getTime();
        if (start < earliest || start > horizon) continue;
        const end = start + durationMin * 60000;
        let ok = true;
        for (let t = start; t < end; t += STEP) if (!covered(t)) ok = false;
        if (ok && busy.some((b) => start < b.end && end > b.start)) ok = false;
        if (ok) slots.add(new Date(start).toISOString());
      }
    }
  }
  return [...slots].sort();
}

export type LessonItem = {
  id: string;
  startsAt: Date;
  durationMin: number;
  subject: string | null;
  status: "booked" | "cancelled";
  isTrial: boolean;
  teacherName: string;
  teacherSlug: string;
  teacherGradient: string;
  studentName: string;
  childName: string | null;
};

const LESSON_SELECT = `SELECT l.id, l.starts_at, l.duration_min, l.subject, l.status, l.is_trial,
       t.display_name AS teacher_name, t.slug AS teacher_slug, t.gradient AS teacher_gradient,
       CONCAT(u.first_name, ' ', u.last_name) AS student_name, c.first_name AS child_name
  FROM lessons l
  JOIN teacher_profiles t ON t.id = l.teacher_profile_id
  JOIN users u ON u.id = l.student_id
  LEFT JOIN children c ON c.id = l.child_id`;

type LessonRow = {
  id: string;
  starts_at: Date;
  duration_min: number;
  subject: string | null;
  status: "booked" | "cancelled";
  is_trial: number;
  teacher_name: string;
  teacher_slug: string;
  teacher_gradient: string;
  student_name: string;
  child_name: string | null;
};

const toItem = (r: LessonRow): LessonItem => ({
  id: r.id,
  startsAt: new Date(r.starts_at),
  durationMin: r.duration_min,
  subject: r.subject,
  status: r.status,
  isTrial: !!r.is_trial,
  teacherName: r.teacher_name,
  teacherSlug: r.teacher_slug,
  teacherGradient: r.teacher_gradient,
  studentName: r.student_name,
  childName: r.child_name,
});

/** Cours à venir (et en cours) d'un élève. */
export async function studentLessons(userId: string) {
  await migrate();
  const rows = await query<LessonRow>(
    `${LESSON_SELECT} WHERE l.student_id = ? AND l.status = 'booked'
       AND l.starts_at + INTERVAL l.duration_min MINUTE > UTC_TIMESTAMP() ORDER BY l.starts_at`,
    [userId],
  );
  return rows.map(toItem);
}

/** Cours à venir d'un enseignant (via son profil). */
export async function teacherLessons(userId: string) {
  await migrate();
  const rows = await query<LessonRow>(
    `${LESSON_SELECT} WHERE t.user_id = ? AND l.status = 'booked'
       AND l.starts_at + INTERVAL l.duration_min MINUTE > UTC_TIMESTAMP() ORDER BY l.starts_at`,
    [userId],
  );
  return rows.map(toItem);
}

/** Tous les cours (administration) : à venir, puis les 30 derniers jours. */
export async function allLessons() {
  await migrate();
  const rows = await query<LessonRow>(
    `${LESSON_SELECT} WHERE l.starts_at > UTC_TIMESTAMP() - INTERVAL 30 DAY ORDER BY l.starts_at DESC LIMIT 300`,
  );
  return rows.map(toItem);
}

/** Un cours, seulement pour l'élève, l'enseignant ou un admin. */
export async function lessonForUser(lessonId: string, user: { id: string; role: string }) {
  await migrate();
  const rows = await query<LessonRow & { student_id: string; teacher_user: string | null }>(
    `${LESSON_SELECT.replace("SELECT l.id,", "SELECT l.id, l.student_id, t.user_id AS teacher_user,")} WHERE l.id = ?`,
    [lessonId],
  );
  const r = rows[0];
  if (!r || (r.student_id !== user.id && r.teacher_user !== user.id && user.role !== "admin")) return null;
  return { ...toItem(r), iAmTeacher: r.teacher_user === user.id };
}
