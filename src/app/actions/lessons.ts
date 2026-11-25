"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { randomUUID } from "node:crypto";
import { requireUser } from "@/lib/server/auth";
import { execute, pool, query } from "@/lib/server/db";
import { freeSlots } from "@/lib/server/lessons";
import { getTeacherRowBySlug } from "@/lib/server/messages";
import { getTeacherRowByUser, toTeacher } from "@/lib/server/teachers";
import { notify, siteUrl } from "@/lib/server/mail";
import { isTimezone } from "@/lib/time";
import type { FormState } from "./auth";

const fmt = (d: Date, tz: string) =>
  new Intl.DateTimeFormat("fr-FR", { weekday: "long", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit", timeZone: tz }).format(d);

/* ---------- Disponibilités de l'enseignant ---------- */

export async function saveAvailability(_: FormState, formData: FormData): Promise<FormState> {
  const user = await requireUser("/espace-enseignant");
  const row = await getTeacherRowByUser(user.id);
  if (!row) return { error: "Complétez d'abord votre profil enseignant." };

  const tz = String(formData.get("timezone") ?? "Europe/Paris");
  if (!isTimezone(tz)) return { error: "Fuseau horaire invalide." };

  const cells = new Set(
    formData
      .getAll("slot")
      .map(String)
      .filter((v) => /^[0-6]-(1?\d|2[0-3])$/.test(v)),
  );

  await execute("UPDATE teacher_profiles SET timezone = ? WHERE id = ?", [tz, row.id]);
  await execute("DELETE FROM teacher_availability WHERE teacher_profile_id = ?", [row.id]);
  for (const c of cells) {
    const [w, h] = c.split("-").map(Number);
    await execute("INSERT INTO teacher_availability (teacher_profile_id, weekday, hour) VALUES (?, ?, ?)", [row.id, w, h]);
  }
  revalidatePath("/espace-enseignant");
  return { ok: `Disponibilités enregistrées : ${cells.size} heure${cells.size > 1 ? "s" : ""} par semaine.` };
}

/* ---------- Réservation ---------- */

export async function bookLesson(_: FormState, formData: FormData): Promise<FormState> {
  const slug = String(formData.get("teacher") ?? "");
  const user = await requireUser(`/enseignants/${slug}#reserver`);
  const start = new Date(String(formData.get("start") ?? ""));
  const duration = Number(formData.get("duration")) === 30 ? 30 : 60;
  const subject = String(formData.get("subject") ?? "").slice(0, 80) || null;
  const childId = String(formData.get("child") ?? "") || null;
  const studentTz = isTimezone(String(formData.get("tz") ?? "")) ? String(formData.get("tz")) : "Europe/Paris";
  if (isNaN(start.getTime())) return { error: "Choisissez un créneau." };

  const row = await getTeacherRowBySlug(slug);
  if (!row || row.status !== "approved" || !row.user_id) return { error: "Cet enseignant ne prend pas de réservation pour le moment." };
  if (row.user_id === user.id) return { error: "Vous ne pouvez pas réserver un cours avec vous-même." };
  const t = toTeacher(row);

  // Règles d'accès : même genre pour un adulte ; pour un enfant, l'enseignant doit accepter son genre.
  let childName: string | null = null;
  if (childId) {
    const [child] = await query<{ first_name: string; gender: "garcon" | "fille" }>(
      "SELECT first_name, gender FROM children WHERE id = ? AND parent_id = ?",
      [childId, user.id],
    );
    if (!child) return { error: "Enfant introuvable." };
    if (!t.accepts.includes(child.gender)) return { error: `${t.name} ne prend pas de cours pour ${child.first_name}.` };
    childName = child.first_name;
  } else if (!(t.gender === user.gender && t.accepts.includes(user.gender))) {
    return { error: "Ce cours est réservé aux enfants : choisissez pour quel enfant vous réservez." };
  }

  // Le créneau doit toujours être libre (on recalcule côté serveur, verrou contre les doubles réservations)
  const conn = await pool().getConnection();
  let lessonId = "";
  try {
    await conn.query("SELECT GET_LOCK(?, 10)", [`lesson-${row.id}`]);
    const slots = await freeSlots({ id: row.id, timezone: row.timezone }, duration, user.id);
    if (!slots.includes(start.toISOString())) return { error: "Ce créneau vient d'être pris. Choisissez-en un autre." };
    const [{ n }] = await query<{ n: number }>("SELECT COUNT(*) AS n FROM lessons WHERE student_id = ? AND status = 'booked'", [user.id]);
    lessonId = randomUUID();
    await execute(
      `INSERT INTO lessons (id, teacher_profile_id, student_id, child_id, starts_at, duration_min, subject, is_trial, student_timezone)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [lessonId, row.id, user.id, childId, start, duration, subject, Number(n) === 0 ? 1 : 0, studentTz],
    );
  } finally {
    await conn.query("SELECT RELEASE_LOCK(?)", [`lesson-${row.id}`]).catch(() => {});
    conn.release();
  }

  const who = childName ? `${childName} (enfant de ${user.firstName})` : `${user.firstName} ${user.lastName}`;
  const what = `${duration === 30 ? "30 min" : "1 heure"}${subject ? ` · ${subject}` : ""}`;
  await notify(
    user.email,
    `Cours réservé avec ${t.name}`,
    `Bonjour ${user.firstName},\n\nVotre cours est réservé :\n• ${t.name}\n• ${fmt(start, studentTz)}\n• ${what}\n\nLe jour J, rejoignez le cours depuis e-team :\n${siteUrl()}/cours/${lessonId}\n\nL'équipe e-team`,
  );
  const [teacherUser] = await query<{ email: string; first_name: string }>("SELECT email, first_name FROM users WHERE id = ?", [row.user_id]);
  if (teacherUser) {
    await notify(
      teacherUser.email,
      `Nouveau cours réservé : ${who}`,
      `Bonjour ${teacherUser.first_name},\n\n${who} a réservé un cours avec vous :\n• ${fmt(start, row.timezone)} (votre heure)\n• ${what}\n\nDétails et accès au cours :\n${siteUrl()}/cours/${lessonId}\n\nL'équipe e-team`,
    );
  }

  revalidatePath("/mon-compte");
  revalidatePath("/espace-enseignant");
  redirect(`/cours/${lessonId}?reserve=1`);
}

/* ---------- Annulation ---------- */

export async function cancelLesson(lessonId: string) {
  const user = await requireUser("/mon-compte");
  const [l] = await query<{
    student_id: string;
    teacher_user: string | null;
    starts_at: Date;
    status: string;
    teacher_name: string;
    student_timezone: string;
    timezone: string;
  }>(
    `SELECT l.student_id, t.user_id AS teacher_user, l.starts_at, l.status, t.display_name AS teacher_name, l.student_timezone, t.timezone
       FROM lessons l JOIN teacher_profiles t ON t.id = l.teacher_profile_id WHERE l.id = ?`,
    [lessonId],
  );
  if (!l || l.status !== "booked") redirect("/mon-compte");
  const allowed = l.student_id === user.id || l.teacher_user === user.id || user.role === "admin";
  if (!allowed || new Date(l.starts_at).getTime() < Date.now()) redirect(`/cours/${lessonId}`);

  await execute("UPDATE lessons SET status = 'cancelled', cancelled_by = ? WHERE id = ?", [user.id, lessonId]);

  // Prévenir l'autre personne
  const otherId = l.student_id === user.id ? l.teacher_user : l.student_id;
  if (otherId) {
    const [o] = await query<{ email: string; first_name: string }>("SELECT email, first_name FROM users WHERE id = ?", [otherId]);
    const tz = otherId === l.student_id ? l.student_timezone : l.timezone;
    if (o) {
      await notify(
        o.email,
        "Cours annulé",
        `Bonjour ${o.first_name},\n\nLe cours du ${fmt(new Date(l.starts_at), tz)} a été annulé par ${user.firstName}.\n\nVous pouvez réserver un autre créneau ici :\n${siteUrl()}/enseignants\n\nL'équipe e-team`,
      );
    }
  }
  revalidatePath("/mon-compte");
  revalidatePath("/espace-enseignant");
  redirect(`/cours/${lessonId}`);
}
