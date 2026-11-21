"use server";

import { revalidatePath } from "next/cache";
import { randomBytes, randomUUID } from "node:crypto";
import { z } from "zod";
import { requireAdmin, requireUser } from "@/lib/server/auth";
import { execute, query } from "@/lib/server/db";
import { getTeacherRowByUser } from "@/lib/server/teachers";
import { LANGUAGES, MOMENTS, SUBJECTS } from "@/lib/data";
import type { FormState } from "./auth";

/* ---------- Comptes parents : enfants ---------- */

const childSchema = z.object({
  firstName: z.string().trim().min(1, "Indiquez le prénom de l'enfant.").max(80),
  age: z.coerce.number().int().min(3, "Âge entre 3 et 17 ans.").max(17, "Âge entre 3 et 17 ans."),
  gender: z.enum(["garcon", "fille"], { message: "Indiquez s'il s'agit d'un garçon ou d'une fille." }),
  level: z.enum(["Débutant", "Intermédiaire", "Avancé"]).default("Débutant"),
});

export async function addChild(_: FormState, formData: FormData): Promise<FormState> {
  const user = await requireUser();
  const parsed = childSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };
  const c = parsed.data;
  await execute("INSERT INTO children (id, parent_id, first_name, age, gender, level) VALUES (?, ?, ?, ?, ?, ?)", [
    randomUUID(),
    user.id,
    c.firstName,
    c.age,
    c.gender,
    c.level,
  ]);
  if (user.role === "eleve") await execute("UPDATE users SET role = 'parent' WHERE id = ?", [user.id]);
  revalidatePath("/mon-compte");
  return { ok: `${c.firstName} a bien été ajouté(e).` };
}

export async function removeChild(childId: string) {
  const user = await requireUser();
  await execute("DELETE FROM children WHERE id = ? AND parent_id = ?", [childId, user.id]);
  revalidatePath("/mon-compte");
}

/* ---------- Enseignants : profil ---------- */

const pick = (formData: FormData, name: string, allowed: readonly string[]) =>
  formData.getAll(name).map(String).filter((v) => allowed.includes(v));

const teacherSchema = z.object({
  displayName: z.string().trim().min(2, "Indiquez le nom affiché.").max(120),
  title: z.string().trim().min(2, "Indiquez votre titre (ex. : Rav · Roch Collel).").max(160),
  headline: z.string().trim().min(10, "Ajoutez une phrase d'accroche (10 caractères minimum).").max(200),
  bio: z.string().trim().min(80, "Présentez-vous en quelques lignes (80 caractères minimum).").max(3000),
  country: z.string().trim().min(2, "Indiquez votre pays.").max(80),
  experience: z.string().max(2000).default(""),
});

export async function saveTeacherProfile(_: FormState, formData: FormData): Promise<FormState> {
  const user = await requireUser("/espace-enseignant");
  if (user.role !== "enseignant" && user.role !== "admin") return { error: "Réservé aux comptes enseignants." };

  const parsed = teacherSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };
  const d = parsed.data;

  const subjects = pick(formData, "subjects", SUBJECTS);
  const languages = pick(formData, "languages", LANGUAGES);
  const levels = pick(formData, "levels", ["Débutant", "Intermédiaire", "Avancé"]);
  const available = pick(formData, "available", MOMENTS.map((m) => m.value));
  const kids = pick(formData, "kids", ["garcon", "fille"]);
  if (!subjects.length) return { error: "Choisissez au moins une matière." };
  if (!languages.length) return { error: "Choisissez au moins une langue." };
  if (!levels.length) return { error: "Choisissez au moins un niveau." };
  if (!available.length) return { error: "Choisissez au moins un moment de disponibilité." };

  // Un enseignant reçoit les adultes de son propre genre, et éventuellement des enfants.
  const accepts = [user.gender, ...kids];
  const experience = d.experience.split("\n").map((l) => l.trim()).filter(Boolean).slice(0, 10);
  const submit = formData.get("intent") === "submit";

  const existing = await getTeacherRowByUser(user.id);
  const values = [
    d.displayName, d.title, d.headline, d.bio, d.country,
    JSON.stringify(accepts), JSON.stringify(subjects), JSON.stringify(languages),
    JSON.stringify(levels), JSON.stringify(available), JSON.stringify(experience),
  ];

  if (existing) {
    // Un profil déjà validé reste en ligne ; sinon il passe « en attente » s'il est envoyé.
    const status = existing.status === "approved" ? "approved" : submit ? "pending" : existing.status === "rejected" ? "rejected" : "draft";
    await execute(
      `UPDATE teacher_profiles SET display_name=?, title=?, headline=?, bio=?, country=?, accepts=?, subjects=?, languages=?,
         levels=?, available=?, experience=?, status=? WHERE user_id=?`,
      [...values, status, user.id],
    );
  } else {
    const base = d.displayName
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 80);
    const slug = `${base || "enseignant"}-${randomBytes(3).toString("hex")}`;
    const gradients = ["from-violet-500 to-indigo-600", "from-sky-500 to-blue-600", "from-teal-400 to-emerald-600", "from-pink-500 to-rose-500", "from-amber-400 to-orange-500", "from-fuchsia-500 to-purple-600"];
    await execute(
      `INSERT INTO teacher_profiles (id, user_id, slug, display_name, title, headline, bio, country, accepts, subjects, languages,
         levels, available, experience, gender, status, gradient)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [randomUUID(), user.id, slug, ...values, user.gender, submit ? "pending" : "draft", gradients[Math.floor(Math.random() * gradients.length)]],
    );
  }
  revalidatePath("/espace-enseignant");
  return {
    ok:
      existing?.status === "approved"
        ? "Profil mis à jour."
        : submit
          ? "Profil envoyé ! L'équipe e-team le vérifie avant sa mise en ligne."
          : "Brouillon enregistré.",
  };
}

export async function setAvailableNow(on: boolean) {
  const user = await requireUser("/espace-enseignant");
  await execute("UPDATE teacher_profiles SET available_now = ? WHERE user_id = ? AND status = 'approved'", [on ? 1 : 0, user.id]);
  revalidatePath("/espace-enseignant");
  revalidatePath("/sos");
}

/* ---------- Administration ---------- */

export async function setTeacherStatus(profileId: string, status: "approved" | "rejected", formData?: FormData) {
  await requireAdmin();
  const note = String(formData?.get("note") ?? "").slice(0, 500) || null;
  await execute("UPDATE teacher_profiles SET status = ?, admin_note = ?, available_now = IF(? = 'approved', available_now, 0) WHERE id = ?", [
    status,
    note,
    status,
    profileId,
  ]);
  revalidatePath("/admin");
  revalidatePath("/enseignants");
}

export async function setUserStatus(userId: string, status: "active" | "suspended") {
  const admin = await requireAdmin();
  if (userId === admin.id) return; // on ne peut pas se suspendre soi-même
  await execute("UPDATE users SET status = ? WHERE id = ?", [status, userId]);
  if (status === "suspended") {
    await execute("DELETE FROM sessions WHERE user_id = ?", [userId]);
    await execute("UPDATE teacher_profiles SET available_now = 0 WHERE user_id = ?", [userId]);
  }
  revalidatePath("/admin");
}

export async function removeDemoTeachers() {
  await requireAdmin();
  await execute("DELETE FROM teacher_profiles WHERE is_demo = 1");
  revalidatePath("/admin");
  revalidatePath("/enseignants");
}

/** Liste des enfants du parent connecté. */
export async function myChildren() {
  const user = await requireUser();
  return query<{ id: string; first_name: string; age: number; gender: "garcon" | "fille"; level: string }>(
    "SELECT id, first_name, age, gender, level FROM children WHERE parent_id = ? ORDER BY created_at",
    [user.id],
  );
}
