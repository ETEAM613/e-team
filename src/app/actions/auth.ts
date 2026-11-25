"use server";

import { redirect } from "next/navigation";
import { randomBytes, randomUUID } from "node:crypto";
import { z } from "zod";
import {
  createSession,
  destroySession,
  hashPassword,
  isAdminEmail,
  sha256,
  verifyPassword,
} from "@/lib/server/auth";
import { execute, query } from "@/lib/server/db";
import { migrate } from "@/lib/server/migrate";
import { notify, siteUrl } from "@/lib/server/mail";

export type FormState = { error?: string; ok?: string; fields?: Record<string, string> } | undefined;

/** N'accepte que des redirections internes au site. */
function safeNext(value: FormDataEntryValue | null, fallback: string) {
  const v = typeof value === "string" ? value : "";
  return v.startsWith("/") && !v.startsWith("//") ? v : fallback;
}

const signupSchema = z.object({
  role: z.enum(["eleve", "parent", "enseignant"]),
  gender: z.enum(["homme", "femme"], { message: "Indiquez si vous êtes un homme ou une femme." }),
  firstName: z.string().trim().min(1, "Indiquez votre prénom.").max(80),
  lastName: z.string().trim().min(1, "Indiquez votre nom.").max(80),
  email: z.string().trim().toLowerCase().email("Adresse e-mail invalide.").max(190),
  password: z.string().min(8, "Le mot de passe doit faire au moins 8 caractères.").max(200),
  terms: z.literal("on", { message: "Merci d'accepter les conditions d'utilisation." }),
});

export async function signup(_: FormState, formData: FormData): Promise<FormState> {
  if (!process.env.DATABASE_URL) return { error: "Les inscriptions ouvrent très bientôt." };
  const raw = Object.fromEntries(["role", "gender", "firstName", "lastName", "email", "password", "terms"].map((k) => [k, formData.get(k) ?? undefined]));
  const parsed = signupSchema.safeParse(raw);
  const fields = { firstName: String(raw.firstName ?? ""), lastName: String(raw.lastName ?? ""), email: String(raw.email ?? "") };
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Formulaire incomplet.", fields };
  const d = parsed.data;

  await migrate();
  const existing = await query("SELECT id FROM users WHERE email = ?", [d.email]);
  if (existing.length) return { error: "Un compte existe déjà avec cette adresse. Connectez-vous.", fields };

  const id = randomUUID();
  const role = isAdminEmail(d.email) ? "admin" : d.role;
  await execute(
    "INSERT INTO users (id, email, password_hash, first_name, last_name, gender, role, sos_opt_in) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    [id, d.email, await hashPassword(d.password), d.firstName, d.lastName, d.gender, role, d.role === "enseignant" && formData.get("sos") === "oui" ? 1 : 0],
  );
  await createSession(id);
  await notify(
    d.email,
    "Bienvenue sur e-team !",
    `Bonjour ${d.firstName},

Votre compte e-team est créé. Votre premier cours est offert : choisissez votre enseignant ici :
${siteUrl()}/enseignants

À très vite,
L'équipe e-team`,
  );

  if (d.role === "enseignant") redirect("/espace-enseignant");
  if (d.role === "parent") redirect("/mon-compte#enfants");
  redirect("/enseignants");
}

export async function login(_: FormState, formData: FormData): Promise<FormState> {
  if (!process.env.DATABASE_URL) return { error: "Les connexions ouvrent très bientôt." };
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const fields = { email };
  if (!email || !password) return { error: "Indiquez votre e-mail et votre mot de passe.", fields };

  await migrate();
  const rows = await query<{ id: string; password_hash: string; status: string; role: string }>(
    "SELECT id, password_hash, status, role FROM users WHERE email = ?",
    [email],
  );
  const u = rows[0];
  if (!u || !(await verifyPassword(password, u.password_hash))) return { error: "E-mail ou mot de passe incorrect.", fields };
  if (u.status === "suspended") return { error: "Ce compte est suspendu. Contactez l'équipe e-team.", fields };
  if (isAdminEmail(email) && u.role !== "admin") await execute("UPDATE users SET role = 'admin' WHERE id = ?", [u.id]);

  await createSession(u.id);
  redirect(safeNext(formData.get("suite"), "/mon-compte"));
}

export async function logout() {
  await destroySession();
  redirect("/");
}

export async function requestPasswordReset(_: FormState, formData: FormData): Promise<FormState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const done: FormState = { ok: "Si un compte existe avec cette adresse, un e-mail vient de vous être envoyé." };
  if (!email) return { error: "Indiquez votre adresse e-mail." };

  await migrate();
  const rows = await query<{ id: string; first_name: string }>("SELECT id, first_name FROM users WHERE email = ?", [email]);
  if (!rows[0]) return done; // ne révèle pas si l'adresse existe

  const token = randomBytes(32).toString("base64url");
  await execute("INSERT INTO password_resets (token_hash, user_id, expires_at) VALUES (?, ?, ?)", [
    sha256(token),
    rows[0].id,
    new Date(Date.now() + 3600 * 1000),
  ]);
  await notify(
    email,
    "Réinitialiser votre mot de passe e-team",
    `Bonjour ${rows[0].first_name},\n\nPour choisir un nouveau mot de passe, ouvrez ce lien (valable 1 heure) :\n${siteUrl()}/reinitialiser?jeton=${token}\n\nSi vous n'êtes pas à l'origine de cette demande, ignorez cet e-mail.\n\nL'équipe e-team`,
  );
  return done;
}

export async function resetPassword(_: FormState, formData: FormData): Promise<FormState> {
  const token = String(formData.get("jeton") ?? "");
  const password = String(formData.get("password") ?? "");
  if (password.length < 8) return { error: "Le mot de passe doit faire au moins 8 caractères." };

  await migrate();
  const rows = await query<{ user_id: string }>(
    "SELECT user_id FROM password_resets WHERE token_hash = ? AND used_at IS NULL AND expires_at > UTC_TIMESTAMP()",
    [sha256(token)],
  );
  if (!rows[0]) return { error: "Ce lien a expiré ou a déjà été utilisé. Refaites une demande." };

  await execute("UPDATE users SET password_hash = ? WHERE id = ?", [await hashPassword(password), rows[0].user_id]);
  await execute("UPDATE password_resets SET used_at = UTC_TIMESTAMP() WHERE token_hash = ?", [sha256(token)]);
  await execute("DELETE FROM sessions WHERE user_id = ?", [rows[0].user_id]);
  await createSession(rows[0].user_id);
  redirect("/mon-compte");
}
